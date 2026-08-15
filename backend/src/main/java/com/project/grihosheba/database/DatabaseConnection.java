package com.project.grihosheba.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Griho Sheba's day-to-day persistence goes through Spring Data JPA
 * (see the repository package), which manages its own connection pool from
 * the datasource settings in application.properties. This class exists as
 * a small, explicit JDBC helper for situations where a raw Connection is
 * useful outside of that managed context - e.g. one-off admin scripts,
 * data exports, or diagnostics run from Main.
 *
 * Values below mirror the same PostgreSQL database configured for JPA;
 * update them together if the database ever moves.
 */
public class DatabaseConnection {

    private static final String URL = "jdbc:postgresql://localhost:5432/griho_sheba_new";
    private static final String USERNAME = "postgres";
    private static final String PASSWORD = "0177";

    private static Connection connection;

    private DatabaseConnection() {
        // Utility class - no instances
    }

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        }
        return connection;
    }

    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("Failed to close database connection: " + e.getMessage());
        }
    }
}
