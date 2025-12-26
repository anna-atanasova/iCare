package com.finki.icare.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotenvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Dotenv dotenv;

        try {
            // Configuration needed for IntelliJ, since it runs the app from the project root
            dotenv = Dotenv.configure()
                .directory("./backend")
                .load();
        } catch (Exception e) {
            dotenv = Dotenv.configure()
                .directory(".")
                .load();
        }

        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        Map<String, Object> dotenvProperties = new HashMap<>();

        dotenv.entries().forEach(entry -> {
            dotenvProperties.put(entry.getKey(), entry.getValue());
            System.setProperty(entry.getKey(), entry.getValue());
        });

        environment.getPropertySources()
                .addFirst(new MapPropertySource("dotenvProperties", dotenvProperties));
    }
}
