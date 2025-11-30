# -*- coding: utf-8 -*-
{
    'name': 'Studio Community Base',
    'version': '16.0.1.0.0',
    'category': 'Customizations/Studio',
    'summary': 'Base components for Studio Community Edition',
    'description': '''
        Provides stub implementations of web_enterprise components
        required by web_studio to run on Odoo Community Edition.

        This module creates minimal implementations of:
        - HomeMenu service and component
        - ColorScheme service
        - EnterpriseNavBar component
        - ListRenderer desktop extensions

        These allow web_studio to load and function without the actual
        web_enterprise module.
    ''',
    'author': 'MNametissa',
    'depends': ['web', 'base'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            # Services (must load first)
            'studio_community_base/static/src/services/home_menu_service.js',
            'studio_community_base/static/src/services/color_scheme_service.js',
            # Home Menu (OWL component)
            'studio_community_base/static/src/webclient/home_menu/home_menu.js',
            'studio_community_base/static/src/webclient/home_menu/home_menu.xml',
            'studio_community_base/static/src/webclient/home_menu/home_menu.scss',
            # Navbar (OWL component)
            'studio_community_base/static/src/webclient/navbar/navbar.js',
            'studio_community_base/static/src/webclient/navbar/navbar.xml',
            # List renderer - OWL version
            'studio_community_base/static/src/views/list/list_renderer_desktop.js',
            # List renderer - Legacy version (for older views)
            'studio_community_base/static/src/legacy/js/views/list/list_renderer_desktop.js',
        ],
    },
    'auto_install': False,
    'installable': True,
    'license': 'LGPL-3',
}
