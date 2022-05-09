# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
from odoo import fields, models, api


class AccountMove(models.Model):
    _inherit = 'res.company'

    bank_in_name = fields.Char(string='Banks IBAN')
