package com.opscore.config;

import com.opscore.entity.User;
import com.opscore.repository.UserRepository;
import com.opscore.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);
            //String username = jwtService.extractUsername(token);
            String email = jwtService.extractEmail(token);

            //if (username != null &&
            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                //User user = userRepository.findByUsername(username)
                //User user = userRepository.findByEmail(username)
                User user = userRepository.findByEmail(email)
                        .orElseThrow();

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                //"ROLE_" + user.getRole().name()
                                "ROLE_" + user.getRole().getName()
                        );


                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                //user.getUsername(),
                                user.getEmail(),
                                null,
                                List.of(authority)
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch(JwtException e){

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                response.setContentType("application/json");

                response.getWriter().write("""
                         {
                            "status": 401,
                            "error": "UNAUTHORIZED",
                            "message": "Invalid or expired token"
                        }
                        """);

                return;
            }

          filterChain.doFilter(request, response);
    }
}
