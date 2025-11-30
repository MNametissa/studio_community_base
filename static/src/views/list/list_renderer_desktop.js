/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { ListRenderer } from "@web/views/list/list_renderer";
import { useService } from "@web/core/utils/hooks";
import { isMobileOS } from "@web/core/browser/feature_detection";
import { useState, onWillUnmount } from "@odoo/owl";

/**
 * ListRenderer Desktop Patch - Stub implementation for Community Edition
 *
 * This patch adds the `isStudioEditable` property to ListRenderer which
 * web_studio uses to determine if a list view can be edited in Studio.
 *
 * The Enterprise version also shows a "Promote Studio" dialog - we skip that
 * and just provide the editable flag for Studio to use.
 */
export const patchListRendererDesktop = {
    setup() {
        this._super(...arguments);

        this.userService = useService("user");
        this.actionService = useService("action");

        const list = this.props.list;
        const { actionId, actionType } = this.env.config || {};

        // Determine if this list view could potentially be edited by Studio
        // Requirements:
        // - Not on mobile
        // - User is system admin
        // - This is the root list (not an embedded x2many)
        // - We're in an action window
        const isPotentiallyEditable =
            !isMobileOS() &&
            this.userService.isSystem &&
            list === list.model.root &&
            actionId &&
            actionType === "ir.actions.act_window";

        this.studioEditable = useState({ value: isPotentiallyEditable });

        if (isPotentiallyEditable) {
            const computeStudioEditable = () => {
                // Finalize the computation when the actionService is ready
                const controller = this.actionService.currentController;
                if (!controller) return false;

                const action = controller.action;
                if (!action) return false;

                // Must have an xml_id
                if (!action.xml_id) {
                    return false;
                }

                // Settings views aren't editable (except custom x_settings models)
                if (
                    action.res_model &&
                    action.res_model.indexOf("settings") > -1 &&
                    action.res_model.indexOf("x_") !== 0
                ) {
                    return false;
                }

                // Dashboard isn't editable
                if (action.res_model === "board.board") {
                    return false;
                }

                // QWeb views are not editable
                if (action.view_mode === "qweb") {
                    return false;
                }

                // Knowledge articles have a very custom form view
                if (action.res_model === "knowledge.article") {
                    return false;
                }

                return Boolean(action.res_model);
            };

            const onUiUpdated = () => {
                this.studioEditable.value = computeStudioEditable();
            };

            this.env.bus.addEventListener("ACTION_MANAGER:UI-UPDATED", onUiUpdated);

            onWillUnmount(() => {
                this.env.bus.removeEventListener("ACTION_MANAGER:UI-UPDATED", onUiUpdated);
            });
        }
    },

    /**
     * Whether this list view can be edited in Studio
     * @returns {boolean}
     */
    get isStudioEditable() {
        return this.studioEditable?.value || false;
    },

    /**
     * Set studio editable state
     * @param {boolean} value
     */
    set isStudioEditable(value) {
        if (this.studioEditable) {
            this.studioEditable.value = value;
        }
    },

    /**
     * Whether to display optional fields menu
     * @returns {boolean}
     */
    get displayOptionalFields() {
        return this.isStudioEditable || this.getOptionalFields.length;
    },

    /**
     * Handler for "Add Custom Field" action
     * This is overridden by web_studio to open the field editor
     * In the stub, we do nothing (or could show a message)
     */
    onSelectedAddCustomField() {
        // This will be overridden by web_studio
        // In Enterprise without Studio, this shows a "Promote Studio" dialog
        // In Community stub, we just do nothing
        console.log("Studio: Add Custom Field requested");
    },
};

patch(ListRenderer.prototype, "web_enterprise.ListRendererDesktop", patchListRendererDesktop);
