package com.amaan.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class AuditLogFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        StatusCapturingResponse wrapper = new StatusCapturingResponse(response);
        try {
            chain.doFilter(request, wrapper);
        } finally {
            long duration = System.currentTimeMillis() - start;
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = (auth != null && auth.getPrincipal() instanceof UUID)
                ? auth.getPrincipal().toString() : "anonymous";
            AuditLogger.log("REQUEST", String.format(
                "userId=%s method=%s path=%s status=%d duration=%dms ip=%s",
                userId, request.getMethod(), request.getRequestURI(),
                wrapper.getStatus(), duration, getClientIp(request)
            ));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class StatusCapturingResponse extends HttpServletResponseWrapper {
        private int status = 200;

        StatusCapturingResponse(HttpServletResponse response) {
            super(response);
        }

        @Override
        public void setStatus(int sc) {
            status = sc;
            super.setStatus(sc);
        }

        @Override
        public void sendError(int sc) throws IOException {
            status = sc;
            super.sendError(sc);
        }

        @Override
        public void sendError(int sc, String msg) throws IOException {
            status = sc;
            super.sendError(sc, msg);
        }

        @Override
        public int getStatus() {
            return status;
        }
    }
}
