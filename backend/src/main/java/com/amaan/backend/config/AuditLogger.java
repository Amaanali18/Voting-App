package com.amaan.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class AuditLogger {
    private static final Logger log = LoggerFactory.getLogger("AUDIT");

    private AuditLogger() {}

    public static void log(String action, String details) {
        log.info("{} | {}", action, details);
    }
}
