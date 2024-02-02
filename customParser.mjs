export default function (key, obj) {
  switch (obj.field_type) {
    case 'sbi-annotated-image':
      return {
        [key]: {
          type: 'object',
          properties: {
            image: { type: 'string' },
            mapNodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  x: {
                    type: 'number'
                  },
                  y: {
                    type: 'number'
                  },
                  direction: {
                    type: 'string',
                    enum: ['right', 'left', 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left']
                  }
                },
                additionalProperties: false
              }
            }
          },
          required: ['image', 'mapNodes']
        }
      }
    case 'native-color-picker':
      return {
        [key]: {
          type: 'object',
          properties: {
            color: { type: 'string' }
          },
          required: ['color']
        }
      }
    default:
      return {}
  }
}
