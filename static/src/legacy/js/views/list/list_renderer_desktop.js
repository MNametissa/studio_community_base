odoo.define('studio_community_base.ListRenderer', function (require) {
    "use strict";

    /**
     * Stub implementation of web_enterprise.ListRenderer for Community Edition
     *
     * This provides the minimal patches required for web_studio to work.
     * The Enterprise version also shows a "Promote Studio" dialog, but since
     * we're providing Studio, we just make the button work.
     */

    const config = require('web.config');
    if (config.device.isMobile) {
        return;
    }

    const { qweb } = require('web.core');
    const ListRenderer = require('web.ListRenderer');
    const ListView = require('web.ListView');
    const session = require('web.session');
    const { patch } = require('web.utils');

    // Patch ListView to pass isStudioEditable to renderer
    patch(ListView.prototype, 'web_enterprise.ListView', {
        init: function (viewInfo, params) {
            this._super(viewInfo, params);
            this.rendererParams.isStudioEditable = params.action && !!params.action.xml_id;
        },
    });

    // Patch ListRenderer to add "Add Custom Field" button
    patch(ListRenderer.prototype, 'web_enterprise.ListRenderer', {
        init: function (parent, state, params) {
            this._super(...arguments);
            this.isStudioEditable = params.isStudioEditable;
        },

        /**
         * Add "Add Custom Field" button to optional columns dropdown
         * @override
         */
        _renderOptionalColumnsDropdown: function () {
            const $optionalColumnsDropdown = this._super(...arguments);
            if (session.is_system && this.isStudioEditable) {
                const $dropdownMenu = $optionalColumnsDropdown.find('.dropdown-menu');
                if (this.optionalColumns.length) {
                    $dropdownMenu.append($("<hr />"));
                }
                // Create the "Add Custom Field" button
                const $addCustomField = $('<button class="dropdown-item o_add_custom_field_button">' +
                    '<i class="fa fa-plus me-1"></i> Add Custom Field</button>');
                $dropdownMenu.append($addCustomField);
                $addCustomField.click(this._onAddCustomFieldClick.bind(this));
            }
            return $optionalColumnsDropdown;
        },

        /**
         * Show optional columns dropdown for system users even if no optional columns
         * @override
         */
        _shouldRenderOptionalColumnsDropdown: function () {
            return this._super(...arguments) || session.is_system;
        },

        /**
         * Handle "Add Custom Field" click - will be overridden by web_studio
         * @param {Event} event
         */
        _onAddCustomFieldClick: function (event) {
            event.stopPropagation();
            // This will be overridden by web_studio to open the field editor
            console.log('Studio: Add Custom Field clicked');
        },
    });
});
