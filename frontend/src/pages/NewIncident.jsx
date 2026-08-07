import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import FormField from '../components/forms/FormField.jsx'
import TextInput from '../components/forms/TextInput.jsx'
import SelectInput from '../components/forms/SelectInput.jsx'
import TextAreaInput from '../components/forms/TextAreaInput.jsx'
import { createIncident } from '../services/incidentService.js'

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'payment-api', label: 'Payment API' },
  { value: 'auth-service', label: 'Authentication Service' },
  { value: 'database', label: 'Database Cluster' },
  { value: 'redis', label: 'Redis Cache' },
]

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'Performance', label: 'Performance' },
  { value: 'Availability', label: 'Availability' },
  { value: 'Security', label: 'Security' },
  { value: 'Data', label: 'Data' },
]

const severityOptions = [
  { value: '', label: 'Select a severity' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
]

function NewIncident() {
  const [formData, setFormData] = useState({
    title: '',
    service: '',
    category: '',
    severity: '',
    description: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.title.trim() || formData.title.trim().length < 3) nextErrors.title = 'Title must be at least 3 characters.'
    if (!formData.service) nextErrors.service = 'Please select a service.'
    if (!formData.category) nextErrors.category = 'Please select a category.'
    if (!formData.severity) nextErrors.severity = 'Please select a severity.'
    if (!formData.description.trim() || formData.description.trim().length < 5) nextErrors.description = 'Description must be at least 5 characters.'

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(null)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      const response = await createIncident({
        title: formData.title.trim(),
        service: formData.service,
        category: formData.category,
        severity: formData.severity,
        description: formData.description.trim(),
      })
      setSubmitted(response)
      setFormData({
        title: '',
        service: '',
        category: '',
        severity: '',
        description: '',
      })
    } catch (err) {
      setErrors({ api: err.message || 'Failed to submit incident to backend.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:flex">
        <Sidebar />
        <div className="flex-1 lg:min-w-0">
          <Topbar />
          <main className="px-4 py-6 lg:px-8 lg:py-8">
            <section className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex flex-col gap-2">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">New incident</p>
                <h1 className="text-2xl font-semibold text-white">Create a new incident report</h1>
                <p className="text-sm text-slate-400">Capture the issue details clearly so the response team can triage fast.</p>
              </div>

              {errors.api && (
                <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
                  {errors.api}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 lg:grid-cols-2">
                  <FormField label="Title" id="title" error={errors.title}>
                    <TextInput
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. API latency spike"
                    />
                  </FormField>

                  <FormField label="Service" id="service" error={errors.service}>
                    <SelectInput id="service" name="service" value={formData.service} onChange={handleChange} options={serviceOptions} />
                  </FormField>

                  <FormField label="Category" id="category" error={errors.category}>
                    <SelectInput id="category" name="category" value={formData.category} onChange={handleChange} options={categoryOptions} />
                  </FormField>

                  <FormField label="Severity" id="severity" error={errors.severity}>
                    <SelectInput id="severity" name="severity" value={formData.severity} onChange={handleChange} options={severityOptions} />
                  </FormField>
                </div>

                <FormField label="Description" id="description" error={errors.description}>
                  <TextAreaInput
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the incident, symptoms, and timeline."
                    rows={6}
                  />
                </FormField>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit incident'}
                  </button>
                  {submitted ? (
                    <p className="text-sm text-emerald-400">
                      Incident #{submitted.id} ("{submitted.title}") created successfully!
                    </p>
                  ) : null}
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default NewIncident
