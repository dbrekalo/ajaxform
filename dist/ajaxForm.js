;(function($){

	var instanceCounter = 0;

	function AjaxForm(options){

		this.options = $.extend({}, AjaxForm.defaults, options);
		this.init();

	}

	$.extend(AjaxForm.prototype, {

		init: function(){

			this.$el = typeof this.options.el === 'string' ? $(this.options.el) : this.options.el;
			this.ens = '.ajaxForm' + (++instanceCounter);
			this.deferreds = [];
			this.hasErrors = false;

			if (this.options.preloaded) {

				this.$form = this.$el.find(this.options.formSelector);

			} else {

				this.deferreds.push($.get(this.options.url, $.proxy(this.render, this)));

			}

			this.events();

		},

		events: function(){

			this.$el.on('submit'+this.ens, this.options.formSelector,$.proxy(function(e){

				e.preventDefault();
				this.postForm();

			}, this));

		},

		postForm: function(silent){

			var	deferred = $.post(this.options.url, this.$form.serialize());

			this.deferreds.push(deferred);

			$.when(deferred).done($.proxy(function(responseText){

				if (silent) {
					this.hasErrors && this.onSubmitSuccess(responseText);
				} else {
					this.onSubmitSuccess(responseText);
				}

			}, this)).fail($.proxy(function(jqXHR){

				if(jqXHR.status === this.options.validationErrorStatus) {

					this.onValidationError(jqXHR.responseText);

				} else {
					this.options.onSubmitFail && this.options.onSubmitFail(jqXHR);
				}

			}, this));

			return deferred;

		},

		render: function(html){

			this.$el.html(html);
			this.$form = this.$el.find(this.options.formSelector);
			this.options.afterRender && this.options.afterRender(this.$form ,this);

		},

		onSubmitSuccess: function(responseText){

			this.hasErrors = false;
			this.options.onSubmitSuccess ? this.options.onSubmitSuccess(responseText, this.$form, this) : this.render(responseText);
			this.options.afterSubmitSuccess && this.options.afterSubmitSuccess(responseText, this.$form, this);

		},

		onValidationError: function(responseText){

			this.hasErrors = true;
			this.options.onValidationError ? this.options.onValidationError(responseText, this.$form, this) : this.render(responseText);
			this.options.afterValidationError && this.options.afterValidationError(responseText, this.$form, this);

		},

		destroy: function(){

			this.$el.off(this.ens);
			$.each(this.deferreds, function(i, deferred){
				deferred.state() === 'pending' && deferred.abort();
			});

		}

	});

	AjaxForm.defaults = {
		'url': '',
		'preloaded': true,
		'formSelector': 'form',
		'validationErrorStatus': 400,

		// Callbacks
		'afterRender': null,
		'onValidationError': null,
		'afterValidationError': null,
		'onSubmitSuccess': null,
		'afterSubmitSuccess': null,
		'afterSubmitFail': null
	};

	$.wk = $.wk || {};
	$.wk.ajaxForm = AjaxForm;

})(window.jQuery || window.Zepto);