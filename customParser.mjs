export default function (key, obj) {
  switch (obj.field_type) {
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
