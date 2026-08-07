import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import FormField from '../components/forms/FormField.jsx'
import TextInput from '../components/forms/TextInput.jsx'
import SelectInput from '../components/forms/SelectInput.jsx'
import TextAreaInput from '../components/forms/TextAreaInput.jsx'

const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'payment-api', label: 'Payment API' },
  { value: 'auth-service', label: 'Authentication Service' },
  { value: 'database', label: 'Database Cluster' },
  { value: 'redis', label: 'Redis Cache' },
]

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'performance', label: 'Performance' },
  { value: 'availability', label: 'Availability' },
  { value: 'security', label: 'Security' },
  { value: 'data', label: 'Data' },
]

const severityOptions = [
  { value: '', label: 'Select a severity' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
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
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
    if (!formData.service) nextErrors.service = 'Please select a service.'
    if (!formData.category) nextErrors.category = 'Please select a category.'
    if (!formData.severity) nextErrors.severity = 'Please select a severity.'
    if (!formData.description.trim()) nextErrors.description = 'Description is required.'

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(false)
      return
    }

    setErrors({})
    setSubmitted(true)
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
                    className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Submit incident
                  </button>
                  {submitted ? (
                    <p className="text-sm text-emerald-400">Incident draft submitted successfully.</p>
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
