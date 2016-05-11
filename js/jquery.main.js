jQuery(function() {
	initCheckboxSorting();
});

// init checkbox sorting
function initCheckboxSorting() {
	jQuery('[data-checkbox-sort="true"]').checkboxSorting();
}

/*
 * jQuery Checkbox Sorting Plugin
 */

;(function($) {
	'use strict';

	var CheckboxSorting = function(options) {
		this.options = $.extend({}, CheckboxSorting.DEFAULTS, options);
		this.init();
	};

	CheckboxSorting.DEFAULTS = {
		checkboxItems: 'div',
		checkbox: 'input[type="checkbox"][data-sort-id]',
		sections: '[data-sort-id]:not(":checkbox")',

		// callbacks
		onInit: function(instance) {},
		onShow: function(instance, checkbox, section) {},
		onHide: function(instance, checkbox, section) {},
		onDestroy: function(instance) {}
	}

	CheckboxSorting.prototype = {
		init: function() {
			if (this.options.holder) {
				this.initStructure();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		initStructure: function() {
			this.holder = $(this.options.holder);
			this.checkboxItems = this.holder.find(this.options.checkboxItems);
			this.checkbox = this.checkboxItems.find(this.options.checkbox);
			this.sections = $(this.options.sections);
		},
		attachEvents: function() {
			var self = this;

			this.onChangeSort = function() {
				var checkbox = $(this);

				self.changeSort(checkbox);
			};

			this.checkbox.on('change', this.onChangeSort);
		},
		changeSort: function(checkbox) {
			this.sections.hide();
			this.toggleSection();
			this.getCheckboxLength() === 0 ? this.sections.show() : false;
		},
		toggleSection: function() {
			var self = this;

			this.checkbox.each(function() {
				var checkbox = $(this);

				checkbox.is(':checked') ? self.showSection(checkbox) : self.hideSection(checkbox);
			});
		},
		showSection: function(checkbox) {
			var section = this.getTarget(checkbox);
			
			section.show();
			this.makeCallback('onShow', this, checkbox, section);
		},
		hideSection: function(checkbox) {
			var section = this.getTarget(checkbox);

			section.hide();
			this.makeCallback('onHide', this, checkbox, section);
		},
		getTarget: function(checkbox) {
			var checkboxID = checkbox.data('sortId') || '';
			return $('[data-sort-id="' + checkboxID + '"]').not(this.checkbox);
		},
		getCheckboxLength: function() {
			return this.checkbox.filter(':checked').length; 
		},
		resetSort: function() {
			this.checkbox.attr('checked', false);
			this.sections.css({ display: '' });
		},
		destroy: function() {
			this.resetSort();
			this.checkbox.off('change', this.onChangeSort);
			this.makeCallback('onDestroy', this);
		},
		makeCallback: function(name) {
			var args;

			if ($.isFunction(this.options[name])) {
				args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	$.fn.checkboxSorting = function(options) {
		return this.each(function() {
			var settings = $.extend({}, options, { holder: this });
			var instance = new CheckboxSorting(settings);

			$.data(this, 'CheckboxSorting', instance);
		});
	};
}(jQuery));