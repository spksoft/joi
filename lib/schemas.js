'use strict';

const Joi = require('./index');

const Messages = require('./messages');


const internals = {};


exports.preferences = Joi.object({
    allowUnknown: Joi.boolean(),
    abortEarly: Joi.boolean(),
    cache: Joi.boolean(),
    context: Joi.object(),
    convert: Joi.boolean(),
    dateFormat: Joi.only('date', 'iso', 'string', 'time', 'utc'),
    errors: {
        escapeHtml: Joi.boolean(),
        language: [
            Joi.string().invalid(...Object.keys(Messages.errors)),
            Joi.object().ref()
        ],
        wrapArrays: Joi.boolean()
    },
    externals: Joi.boolean(),
    messages: Joi.object(),
    noDefaults: Joi.boolean(),
    nonEnumerables: Joi.boolean(),
    presence: Joi.only('required', 'optional', 'forbidden', 'ignore'),
    skipFunctions: Joi.boolean(),
    stripUnknown: Joi.object({
        arrays: Joi.boolean(),
        objects: Joi.boolean()
    })
        .or('arrays', 'objects')
        .allow(true, false),
    warnings: Joi.boolean()
})
    .strict();


exports.extension = Joi.object({
    base: [
        Joi.object().schema(),
        Joi.func()
    ],
    name: Joi.string().required(),
    coerce: Joi.func().minArity(1).maxArity(3),
    pre: Joi.func().minArity(1).maxArity(3),
    messages: Joi.object(),
    describe: Joi.func().arity(1),
    rules: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        setup: Joi.func().arity(1),
        validate: Joi.func().arity(4),
        params: Joi.object().when('params', {           // Self referencing when() instead of alternatives for better error messages
            is: Joi.object().schema(),
            then: Joi.object().schema('object'),
            otherwise: Joi.object().pattern(/.*/, Joi.object().schema())
        }),
        description: [Joi.string(), Joi.func().arity(1)]
    })
        .or('setup', 'validate'))
})
    .strict();


exports.extensions = Joi.array().items(Joi.object(), Joi.func().arity(1)).strict();
