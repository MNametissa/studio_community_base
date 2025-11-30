/** @odoo-module **/

import { registry } from "@web/core/registry";

/**
 * HomeMenu Service - Stub implementation for Community Edition
 *
 * Provides the home_menu service interface expected by web_studio
 */
const homeMenuService = {
    dependencies: ["menu", "action"],

    start(env, { menu, action }) {
        let hasHomeMenu = false;
        let hasBackgroundAction = false;

        return {
            get hasHomeMenu() {
                return hasHomeMenu;
            },
            set hasHomeMenu(value) {
                hasHomeMenu = value;
            },
            get hasBackgroundAction() {
                return hasBackgroundAction;
            },
            set hasBackgroundAction(value) {
                hasBackgroundAction = value;
            },
            toggle() {
                // Toggle home menu visibility - stub implementation
                hasHomeMenu = !hasHomeMenu;
            },
            async show() {
                hasHomeMenu = true;
            },
            async hide() {
                hasHomeMenu = false;
            },
        };
    },
};

registry.category("services").add("home_menu", homeMenuService);
