odoo.define("telenoc_pos_ext.models", function (require){
    "use strict";
    const models = require('point_of_sale.models');
    var utils = require('web.utils');

    var round_di = utils.round_decimals;
    var round_pr = utils.round_precision;

    var posmodel_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function (session, attributes) {
            var self = this;
            // some new code in this method
//            models.load_fields('pos.order.line',['product_subsidy']);
            models.load_fields('pos.order',['c_untaxed_amount', 'c_amount', 'c_discount_amount', 'c_total_amount','c_tax_amount','uni_discount','uni_discount_type','uni_discount_am']);
//            models.load_fields('res.partner',['identification_number']);
            posmodel_super.initialize.apply(this, arguments);
        },
    });

    var super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function(attributes,options){
            let res = super_order.initialize.apply(this,arguments);
            if (!options.json) {
                this.c_untaxed_amount = 0;
                this.c_amount = 0;
                this.c_discount_amount = 0;
                this.c_total_amount = 0;
                this.c_tax_amount = 0;
                this.uni_discount = 0;
                this.uni_discount_type = '';
                this.uni_discount_am = 0;
            }
            return res;
        },
        export_as_JSON: function() {
            let json = super_order.export_as_JSON.apply(this, arguments);
            json.c_untaxed_amount = this.get_c_untaxed_amount();
            json.c_amount = this.get_c_amount();
            json.c_discount_amount = this.get_c_discount_amount();
            json.c_total_amount = this.get_c_total_amount();
            json.c_tax_amount = this.get_c_tax_amount();
            json.uni_discount = this.get_uni_discount();
            json.uni_discount_type = this.get_uni_discount_type();
            json.uni_discount_am = this.get_uni_discount_am();

            return json;
        },
        export_for_printing: function(){
            let json = super_order.export_for_printing.apply(this, arguments);
            json.c_untaxed_amount = this.get_c_untaxed_amount();
            json.c_amount = this.get_c_amount();
            json.c_discount_amount = this.get_c_discount_amount();
            json.c_total_amount = this.get_c_total_amount();
            json.c_tax_amount = this.get_c_tax_amount();
            json.uni_discount = this.get_uni_discount();
            json.uni_discount_type = this.get_uni_discount_type();
            json.uni_discount_am = this.get_uni_discount_am();

            return json;
        },

        get_c_untaxed_amount: function() {
        return this.get_total_without_tax();
        },
        set_c_untaxed_amount: function(c_untaxed_amount) {
            this.c_untaxed_amount=c_untaxed_amount;
        },
        get_uni_discount: function() {
        if (this.uni_discount === undefined){
        return 0.00;}
        else{
        return this.uni_discount;
        }

        },
        set_uni_discount: function(uni_discount) {
            this.uni_discount=uni_discount;
//            this.render();
            this.trigger('change',this);

        },

        get_uni_discount_type: function() {
        return this.uni_discount_type;
        },
        set_uni_discount_type: function(uni_discount_type) {
            this.uni_discount_type=uni_discount_type;

        },

        get_uni_discount_am: function() {
        if (this.uni_discount_am === undefined){
        return 0.00;}
        else{
        return this.uni_discount_am;
        }
        },
        set_uni_discount_am: function(uni_discount_am) {
            this.uni_discount_am=uni_discount_am;
            this.trigger('change',this);
        },

        get_c_tax_amount: function() {
            return this.get_total_tax();
//            return - ;
        },
        get_total_with_tax: function() {
         return this.get_c_total_amount();
        },
        set_c_tax_amount: function(c_tax_amount) {
            this.c_tax_amount=c_tax_amount;
        },
        get_c_amount: function() {
            return this.get_c_untaxed_amount() + this.get_c_tax_amount();
        },
        set_c_amount: function(c_amount) {
            this.c_amount=c_amount;
        },
        get_c_discount_amount: function() {
            return this.get_total_discount();

        },
        set_c_discount_amount: function(c_discount_amount) {
            this.c_discount_amount=c_discount_amount;
        },

        set_c_total_amount: function(c_total_amount) {
            this.c_total_amount=c_total_amount;
        },
        get_c_total_amount: function() {
            return this.get_c_untaxed_amount() + this.get_c_tax_amount() + this.get_uni_discount();
        },


    });

});