// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.ui.form.on("Salary Slip", {
	setup: function (frm) {
		$.each(["earnings", "deductions", "company_contribution"], function (i, table_fieldname) {
			frm.get_field(table_fieldname).grid.editable_fields = [
				{ fieldname: "salary_component", columns: 6 },
				{ fieldname: "amount", columns: 4 },
			];
		});

		frm.fields_dict["timesheets"].grid.get_field("time_sheet").get_query = function () {
			return {
				filters: {
					employee: frm.doc.employee,
				},
			};
		};

		frm.set_query("salary_component", "earnings", function () {
			return {
				filters: {
					type: "earning",
				},
			};
		});

		frm.set_query("salary_component", "deductions", function () {
			return {
				filters: {
					type: "deduction",
				},
			};
		});

		frm.set_query("salary_component", "company_contribution", function () {
			return {
				filters: {
					type: "company_contribution",
				},
			};
		});

		frm.set_query("employee", function () {
			return {
				query: "erpnext.controllers.queries.employee_query",
			};
		});

		frm.trigger("set_payment_days_description");
	},

	validate: function (frm) {
		frm.trigger("set_payment_days_description");
	},

	// Remaining methods remain unchanged

	set_dynamic_labels: function (frm) {
		if (frm.doc.employee && frm.doc.currency) {
			frappe.run_serially([
				() => frm.events.change_form_labels(frm),
				() => frm.events.change_grid_labels(frm),
				() => frm.refresh_fields(),
			]);
		}
	},

	change_grid_labels: function (frm) {
		let fields = [
			"amount",
			"year_to_date",
			"default_amount",
			"additional_amount",
			"tax_on_flexible_benefit",
			"tax_on_additional_salary",
		];

		frm.set_currency_labels(fields, frm.doc.currency, "earnings");
		frm.set_currency_labels(fields, frm.doc.currency, "deductions");
		frm.set_currency_labels(fields, frm.doc.currency, "company_contribution");
	},

	refresh: function (frm) {
		frm.trigger("toggle_fields");

		var salary_detail_fields = [
			"formula",
			"abbr",
			"statistical_component",
			"variable_based_on_taxable_salary",
		];
		frm.fields_dict["earnings"].grid.set_column_disp(salary_detail_fields, false);
		frm.fields_dict["deductions"].grid.set_column_disp(salary_detail_fields, false);
		frm.fields_dict["company_contribution"].grid.set_column_disp(salary_detail_fields, false);
		frm.trigger("set_dynamic_labels");
	},
});

frappe.ui.form.on("Salary Detail", {
	amount: function (frm) {
		set_totals(frm);
	},

	earnings_remove: function (frm) {
		set_totals(frm);
	},

	deductions_remove: function (frm) {
		set_totals(frm);
	},

	company_contribution_remove: function (frm) {
		set_totals(frm);
	},

	salary_component: function (frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		if (child.salary_component) {
			frappe.call({
				method: "frappe.client.get",
				args: {
					doctype: "Salary Component",
					name: child.salary_component,
				},
				callback: function (data) {
					if (data.message) {
						var result = data.message;
						frappe.model.set_value(cdt, cdn, "condition", result.condition);
						frappe.model.set_value(
							cdt,
							cdn,
							"amount_based_on_formula",
							result.amount_based_on_formula,
						);
						if (result.amount_based_on_formula === 1) {
							frappe.model.set_value(cdt, cdn, "formula", result.formula);
						} else {
							frappe.model.set_value(cdt, cdn, "amount", result.amount);
						}
						frappe.model.set_value(
							cdt,
							cdn,
							"statistical_component",
							result.statistical_component,
						);
						frappe.model.set_value(
							cdt,
							cdn,
							"depends_on_payment_days",
							result.depends_on_payment_days,
						);
						frappe.model.set_value(
							cdt,
							cdn,
							"do_not_include_in_total",
							result.do_not_include_in_total,
						);
						frappe.model.set_value(
							cdt,
							cdn,
							"variable_based_on_taxable_salary",
							result.variable_based_on_taxable_salary,
						);
						frappe.model.set_value(
							cdt,
							cdn,
							"is_tax_applicable",
							result.is_tax_applicable,
						);
						frappe.model.set_value(
							cdt,
							cdn,
							"is_flexible_benefit",
							result.is_flexible_benefit,
						);
						refresh_field("earnings");
						refresh_field("deductions");
						refresh_field("company_contribution");
					}
				},
			});
		}
	},
});

var set_totals = function (frm) {
	if (frm.doc.docstatus === 0 && frm.doc.doctype === "Salary Slip") {
		if (frm.doc.earnings || frm.doc.deductions || frm.doc.company_contribution) {
			frappe.call({
				method: "set_totals",
				doc: frm.doc,
				callback: function () {
					frm.refresh_fields();
				},
			});
		}
	}
};
