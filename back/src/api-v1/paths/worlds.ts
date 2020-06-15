var YAML = require('json2yaml')
export default function(worldsService) {
    let operations = {
      GET
    };
   
    function GET(req, res, next) {
      res.status(200).json(worldsService.getWorlds(req.query.worldName));
    }
   
    // NOTE: We could also use a YAML string here.
    GET.apiDoc = YAML.stringify({
      summary: '"Returns worlds by name."',
      operationId: '"getWorlds"',
      parameters: [
        {
          in: '"query"',
          name: '"worldName"',
          required: true,
          type: '"string"'
        }
      ],
      responses: {
        200: {
          description: '"A list of worlds that match the requested name."',
          schema: {
            type: '"array"',
            items: {
              $ref: '"#/definitions/World"'
            }
          }
        },
        default: {
          description: '"An error occurred"',
          schema: {
            additionalProperties: true
          }
        }
      }
    });
   
    return operations;
  }