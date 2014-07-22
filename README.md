#Ajaxform

JS handler for handling async forms

##Usage

Run handler on html structure similiar to one bellow. Handler will fetch data from server with url specified in options.
If form is already in html provide handler with preloaded option.
Response after form submit (with or without validation errors) will be rendered inside handler containter (el option).
If you need to override this behaviour provide onSubmitSuccess and onValidationError callbacks.
Callbacks prefixed with "after" keyword are run after these callbacks.

```html
<div class="formCont"></div>
```

```javascript

var formHandler = new app.ajaxForm({
	el: '.formCont',
	url: '/form-submit'
});

//Form is already in html
var $formCont = $('.formCont');

var formHandler = new app.ajaxForm({
	el: $formCont,
	url: $formCont.find('form').attr('action'),
	preloaded: true,
	afterRender: function($form){ $form.addClass('rendered'); },
	afterSubmitSuccess: function(response, $form, handlerObj){ console.log('Form saved'); },
	afterValidationError: function(response, $form, handlerObj){ $form.find('.error').addClass('focused'); }
});

```

##Available options / defaults

```javascript
AjaxForm.defaults = {
	'el': null,
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
```