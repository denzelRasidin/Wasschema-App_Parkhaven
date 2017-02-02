package nl.parkhaven.wasschema.util;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public final class Database {

	private static ComboPooledDataSource dataSource;

	private Database() {
	}

	private void initializeDataSource() throws PropertyVetoException {
		dataSource = new ComboPooledDataSource();
		dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
		dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/parkhaven?serverTimezone=CET&useSSL=false");
		dataSource.setUser("root");
		dataSource.setPassword("geheim");
		dataSource.setMinPoolSize(3);
		dataSource.setMaxPoolSize(20);
		dataSource.setAcquireIncrement(3);
		dataSource.setMaxConnectionAge(14400); // 4 hours
		dataSource.setMaxIdleTimeExcessConnections(300);
	}

	public static Connection getConnection() throws SQLException, PropertyVetoException {
		if (dataSource == null) {
			new Database().initializeDataSource();
		}

		return dataSource.getConnection();
	}

	public static void closeConnection() {
		if (dataSource != null) {
			dataSource.close();
		}
	}

}
