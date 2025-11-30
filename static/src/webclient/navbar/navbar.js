/** @odoo-module **/

import { NavBar } from "@web/webclient/navbar/navbar";
import { useService } from "@web/core/utils/hooks";
import { useRef, useEffect } from "@odoo/owl";

/**
 * EnterpriseNavBar - Stub implementation for Community Edition
 *
 * This component extends the Community NavBar to provide the interface
 * expected by web_studio. It adds properties and methods that Studio
 * relies on for navigation state management.
 */
export class EnterpriseNavBar extends NavBar {
    setup() {
        super.setup();

        // Services that may be used by Studio
        this.homeMenuService = null;
        try {
            this.homeMenuService = useService("home_menu");
        } catch (e) {
            // home_menu service may not exist in Community
        }

        this.menuAppsRef = useRef("menuApps");
        this.navRef = useRef("nav");

        // Track background action state
        this._hasBackgroundAction = false;
        this._isInApp = true;

        useEffect(() => {
            this._updateMenuAppsIcon();
        });
    }

    /**
     * Whether there's a background action (used by Studio)
     * @returns {boolean}
     */
    get hasBackgroundAction() {
        if (this.homeMenuService) {
            return this.homeMenuService.hasBackgroundAction || false;
        }
        return this._hasBackgroundAction;
    }

    /**
     * Set background action state
     * @param {boolean} value
     */
    set hasBackgroundAction(value) {
        this._hasBackgroundAction = value;
    }

    /**
     * Whether we're currently in an app (not home menu)
     * @returns {boolean}
     */
    get isInApp() {
        if (this.homeMenuService) {
            return !this.homeMenuService.hasHomeMenu;
        }
        return this._isInApp;
    }

    /**
     * Set isInApp state
     * @param {boolean} value
     */
    set isInApp(value) {
        this._isInApp = value;
    }

    /**
     * Update the menu apps icon visibility and state
     * @private
     */
    _updateMenuAppsIcon() {
        const menuAppsEl = this.menuAppsRef.el;
        if (!menuAppsEl) return;

        menuAppsEl.classList.toggle("o_hidden", !this.isInApp && !this.hasBackgroundAction);
        menuAppsEl.classList.toggle(
            "o_menu_toggle_back",
            !this.isInApp && this.hasBackgroundAction
        );

        const title = !this.isInApp && this.hasBackgroundAction
            ? this.env._t("Previous view")
            : this.env._t("Home menu");

        menuAppsEl.title = title;
        menuAppsEl.setAttribute("aria-label", title);

        const menuBrand = this.navRef.el?.querySelector(".o_menu_brand");
        if (menuBrand) {
            menuBrand.classList.toggle("o_hidden", !this.isInApp);
        }

        const appSubMenus = this.appSubMenus?.el;
        if (appSubMenus) {
            appSubMenus.classList.toggle("o_hidden", !this.isInApp);
        }
    }

    /**
     * Handle menu toggle (override point for Studio)
     */
    onMenuToggle() {
        // This will be overridden by Studio's StudioNavbar
        if (this.homeMenuService) {
            this.homeMenuService.toggle();
        }
    }
}

EnterpriseNavBar.template = "studio_community_base.EnterpriseNavBar";
