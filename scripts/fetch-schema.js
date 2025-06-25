const fs = require('fs');
const path = require('path');

async function fetchSchema() {
  try {
    console.log('Fetching GraphQL schema from Drupal...');
    
    const response = await fetch('http://localhost:3000/api/test-graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query IntrospectionQuery {
            __schema {
              queryType { name }
              mutationType { name }
              subscriptionType { name }
              types {
                ...FullType
              }
              directives {
                name
                description
                locations
                args {
                  ...InputValue
                }
              }
            }
          }

          fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
              name
              description
              args {
                ...InputValue
              }
              type {
                ...TypeRef
              }
              isDeprecated
              deprecationReason
            }
            inputFields {
              ...InputValue
            }
            interfaces {
              ...TypeRef
            }
            enumValues(includeDeprecated: true) {
              name
              description
              isDeprecated
              deprecationReason
            }
            possibleTypes {
              ...TypeRef
            }
          }

          fragment InputValue on __InputValue {
            name
            description
            type { ...TypeRef }
            defaultValue
          }

          fragment TypeRef on __Type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                      ofType {
                        kind
                        name
                        ofType {
                          kind
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    // Save the schema to a file
    const schemaPath = path.join(__dirname, '..', 'schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(result.data, null, 2));
    
    console.log('Schema saved to schema.json');
    return result.data;
    
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw error;
  }
}

fetchSchema(); 