/** @odoo-module **/

import { Component, useState, useRef, onMounted, onWillUpdateProps } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { useHotkey } from "@web/core/hotkeys/hotkey_hook";
import { isMobileOS } from "@web/core/browser/feature_detection";

/**
 * HomeMenu - Stub implementation for Community Edition
 *
 * This component provides a functional home menu that displays
 * application icons in a grid layout with keyboard navigation.
 * It replaces the Enterprise HomeMenu component.
 */
export class HomeMenu extends Component {
    setup() {
        this.menus = useService("menu");
        this.ui = useService("ui");

        this.state = useState({
            focusedIndex: null,
        });

        this.inputRef = useRef("input");

        onMounted(() => {
            if (!isMobileOS()) {
                this._focusInput();
            }
        });

        onWillUpdateProps(() => {
            this.state.focusedIndex = null;
        });

        // Register keyboard navigation hotkeys
        if (!this.env.isSmall) {
            this._registerHotkeys();
        }
    }

    //--------------------------------------------------------------------------
    // Getters
    //--------------------------------------------------------------------------

    /**
     * @returns {Object[]} List of apps to display
     */
    get displayedApps() {
        return this.props.apps;
    }

    /**
     * @returns {number} Maximum icons per row based on screen width
     */
    get maxIconNumber() {
        const w = window.innerWidth;
        if (w < 576) {
            return 3;
        } else if (w < 768) {
            return 4;
        } else {
            return 6;
        }
    }

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Open a menu/app
     * @private
     * @param {Object} menu - The menu to open
     * @returns {Promise}
     */
    _openMenu(menu) {
        return this.menus.selectMenu(menu);
    }

    /**
     * Focus the search input
     * @private
     */
    _focusInput() {
        if (!this.env.isSmall && this.inputRef.el) {
            this.inputRef.el.focus({ preventScroll: true });
        }
    }

    /**
     * Update focused index based on navigation command
     * @private
     * @param {string} cmd - Navigation command
     */
    _updateFocusedIndex(cmd) {
        const nbrApps = this.displayedApps.length;
        const lastIndex = nbrApps - 1;
        const focusedIndex = this.state.focusedIndex;

        if (lastIndex < 0) {
            return;
        }

        if (focusedIndex === null) {
            this.state.focusedIndex = 0;
            return;
        }

        const lineNumber = Math.ceil(nbrApps / this.maxIconNumber);
        const currentLine = Math.ceil((focusedIndex + 1) / this.maxIconNumber);
        let newIndex;

        switch (cmd) {
            case "previousElem":
                newIndex = focusedIndex - 1;
                break;
            case "nextElem":
                newIndex = focusedIndex + 1;
                break;
            case "previousColumn":
                if (focusedIndex % this.maxIconNumber) {
                    newIndex = focusedIndex - 1;
                } else {
                    newIndex = focusedIndex + Math.min(lastIndex - focusedIndex, this.maxIconNumber - 1);
                }
                break;
            case "nextColumn":
                if (focusedIndex === lastIndex || (focusedIndex + 1) % this.maxIconNumber === 0) {
                    newIndex = (currentLine - 1) * this.maxIconNumber;
                } else {
                    newIndex = focusedIndex + 1;
                }
                break;
            case "previousLine":
                if (currentLine === 1) {
                    newIndex = focusedIndex + (lineNumber - 1) * this.maxIconNumber;
                    if (newIndex > lastIndex) {
                        newIndex = lastIndex;
                    }
                } else {
                    newIndex = focusedIndex - this.maxIconNumber;
                }
                break;
            case "nextLine":
                if (currentLine === lineNumber) {
                    newIndex = focusedIndex % this.maxIconNumber;
                } else {
                    newIndex = focusedIndex + Math.min(this.maxIconNumber, lastIndex - focusedIndex);
                }
                break;
        }

        // Normalize if out of bounds
        if (newIndex < 0) {
            newIndex = lastIndex;
        } else if (newIndex > lastIndex) {
            newIndex = 0;
        }

        this.state.focusedIndex = newIndex;
    }

    /**
     * Register keyboard hotkeys for navigation
     * @private
     */
    _registerHotkeys() {
        const hotkeys = [
            ["ArrowDown", () => this._updateFocusedIndex("nextLine")],
            ["ArrowRight", () => this._updateFocusedIndex("nextColumn")],
            ["ArrowUp", () => this._updateFocusedIndex("previousLine")],
            ["ArrowLeft", () => this._updateFocusedIndex("previousColumn")],
            ["Tab", () => this._updateFocusedIndex("nextElem")],
            ["shift+Tab", () => this._updateFocusedIndex("previousElem")],
            [
                "Enter",
                () => {
                    const menu = this.displayedApps[this.state.focusedIndex];
                    if (menu) {
                        this._openMenu(menu);
                    }
                },
            ],
        ];

        hotkeys.forEach((hotkey) => {
            useHotkey(...hotkey, { allowRepeat: true });
        });
    }

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handle app click
     * @param {Object} app - The clicked app
     */
    _onAppClick(app) {
        this._openMenu(app);
    }

    /**
     * Handle input search (stub - filtering not implemented)
     * @param {Event} ev
     */
    _onInputSearch(ev) {
        // Search filtering not implemented in Community stub
    }

    /**
     * Handle input blur
     * @param {Event} ev
     */
    _onInputBlur(ev) {
        // Reset focus state on blur
    }
}

HomeMenu.template = "web_enterprise.HomeMenu";
HomeMenu.props = {
    apps: {
        type: Array,
        element: {
            type: Object,
            shape: {
                actionID: Number,
                appID: { type: Number, optional: true },
                id: Number,
                label: { type: String, optional: true },
                name: { type: String, optional: true },
                parents: { type: String, optional: true },
                href: { type: String, optional: true },
                webIcon: {
                    type: [
                        Boolean,
                        String,
                        {
                            type: Object,
                            optional: true,
                            shape: {
                                iconClass: { type: String, optional: true },
                                color: { type: String, optional: true },
                                backgroundColor: { type: String, optional: true },
                            },
                        },
                    ],
                    optional: true,
                },
                webIconData: { type: String, optional: true },
                xmlid: { type: String, optional: true },
            },
        },
    },
};
