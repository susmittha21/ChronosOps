import sqlite3
from collections.abc import Generator
from contextlib import contextmanager

from backend.app.config import settings


def get_connection() -> sqlite3.Connection:
    """
    Create and return a SQLite connection.

    row_factory allows database rows to be accessed like dictionaries:
    row["title"] instead of row[0].
    """
    connection = sqlite3.connect(
        settings.database_path,
        check_same_thread=False,
    )

    connection.row_factory = sqlite3.Row

    # Enforce SQLite foreign-key relationships.
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


@contextmanager
def database_connection() -> Generator[sqlite3.Connection, None, None]:
    """
    Open a database connection and close it automatically.

    Commits successful operations and rolls back failed operations.
    """
    connection = get_connection()

    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database() -> None:
    """
    Create the database tables when the backend starts.
    """
    with database_connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                service TEXT NOT NULL,
                severity TEXT NOT NULL
                    CHECK (
                        severity IN (
                            'LOW',
                            'MEDIUM',
                            'HIGH',
                            'CRITICAL'
                        )
                    ),
                category TEXT,
                description TEXT NOT NULL,
                error_message TEXT,
                logs TEXT,

                status TEXT NOT NULL DEFAULT 'OPEN'
                    CHECK (
                        status IN (
                            'OPEN',
                            'INVESTIGATING',
                            'RESOLVED_NOT_SAVED',
                            'RESOLVED_SAVED'
                        )
                    ),

                root_cause TEXT,
                resolution TEXT,
                preventive_action TEXT,
                recovery_time_minutes INTEGER,

                saved_to_memory INTEGER NOT NULL DEFAULT 0,

                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                resolved_at TEXT
            );

            CREATE TABLE IF NOT EXISTS knowledge_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                incident_id INTEGER NOT NULL UNIQUE,

                title TEXT NOT NULL,
                service TEXT NOT NULL,
                severity TEXT NOT NULL,
                category TEXT,

                root_cause TEXT NOT NULL,
                resolution TEXT NOT NULL,
                preventive_action TEXT NOT NULL,
                recovery_time_minutes INTEGER,

                saved_at TEXT NOT NULL,

                FOREIGN KEY (incident_id)
                    REFERENCES incidents(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS
                idx_incidents_status
                ON incidents(status);

            CREATE INDEX IF NOT EXISTS
                idx_incidents_service
                ON incidents(service);

            CREATE INDEX IF NOT EXISTS
                idx_knowledge_service
                ON knowledge_records(service);
            """
        )


def row_to_dict(row: sqlite3.Row | None) -> dict | None:
    """
    Convert one SQLite row into a normal Python dictionary.
    """
    if row is None:
        return None

    result = dict(row)

    if "saved_to_memory" in result:
        result["saved_to_memory"] = bool(
            result["saved_to_memory"]
        )

    return result