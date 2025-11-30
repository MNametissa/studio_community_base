/** @odoo-module **/

import { registry } from "@web/core/registry";

/**
 * ColorScheme Service - Stub implementation for Community Edition
 *
 * Provides the color_scheme service interface expected by web_studio
 */
const colorSchemeService = {
    dependencies: ["cookie"],

    start(env, { cookie }) {
        let currentColorScheme = cookie.current.color_scheme || "light";

        return {
            get activeColorScheme() {
                return currentColorScheme;
            },
            switchToColorScheme(scheme) {
                currentColorScheme = scheme;
                cookie.setCookie("color_scheme", scheme);
                // In Enterprise, this would also apply CSS classes
                // For Community stub, we just track the value
            },
        };
    },
};

registry.category("services").add("color_scheme", colorSchemeService);
