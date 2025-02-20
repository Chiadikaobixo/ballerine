import {
  JSONFormElementBaseParams,
  JSONFormElementParams,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const createFormSchemaFromUIElements = (formElement: UIElement<JSONFormElementParams>) => {
  const formSchema: RJSFSchema = {
    type: formElement.options?.jsonFormDefinition?.type === 'array' ? 'array' : 'object',
    required: formElement.options?.jsonFormDefinition?.required ?? [],
  };

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true,
    },
  };

  if (formSchema.type === 'object') {
    formSchema.properties = {};

    (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
      if (!uiElement.options?.jsonFormDefinition) return;

      const elementDefinition = {
        ...uiElement.options.jsonFormDefinition,
        title: uiElement.options.label,
        description: uiElement.options.description,
      };

      formSchema.properties[uiElement.name] = elementDefinition;

      const elementUISchema = {
        ...uiElement?.options?.uiSchema,
        'ui:label':
          (uiElement.options?.uiSchema || {})['ui:label'] === undefined
            ? Boolean(uiElement?.options?.label)
            : (uiElement.options?.uiSchema || {})['ui:label'],
        'ui:placeholder': uiElement?.options?.hint,
      };

      uiSchema[uiElement.name] = elementUISchema;
    });
  }

  if (formSchema.type === 'array') {
    formSchema.items = {
      type: 'object',
      required: formElement.options?.jsonFormDefinition?.required,
      properties: {},
    };

    //@ts-ignore
    uiSchema.items = {} as AnyObject;

    (formElement.elements as UIElement<JSONFormElementBaseParams>[])?.forEach(uiElement => {
      if (!uiElement.options?.jsonFormDefinition) return;

      const elementDefinition = {
        ...uiElement.options.jsonFormDefinition,
        title: uiElement.options.label,
        description: uiElement.options.description,
      };

      //@ts-nocheck
      (formSchema.items as RJSFSchema).properties[uiElement.name] = elementDefinition;

      const elementUISchema = {
        ...uiElement?.options?.uiSchema,
        'ui:label': Boolean(uiElement?.options?.label),
        'ui:placeholder': uiElement?.options?.hint,
      };

      //@ts-nocheck
      uiSchema.items[uiElement.name] = elementUISchema;
    });
  }

  return {
    formSchema,
    uiSchema,
  };
};
