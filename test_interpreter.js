// Test the pseudocode interpreter directly
const fs = require('fs');
const path = require('path');

// Import the interpreter modules
const { tokenize } = require('./src/interpreter/lexer.js');
const { parse } = require('./src/interpreter/parser.js');
const { Interpreter } = require('./src/interpreter/interpreter.js');

async function testInterpreter() {
  try {
    console.log('Testing PseudoRun Desktop Interpreter...\n');

    // Read test file
    const code = fs.readFileSync('test_example.pseudo', 'utf8');
    console.log('Test code:');
    console.log('---');
    console.log(code);
    console.log('---\n');

    // Tokenize
    console.log('1. Tokenizing...');
    const tokens = tokenize(code);
    console.log(`Tokens created: ${tokens.length}\n`);

    // Parse
    console.log('2. Parsing...');
    const ast = parse(tokens);
    console.log(`AST created with ${ast.statements.length} statements\n`);

    // Execute
    console.log('3. Executing...');
    const interpreter = new Interpreter();

    // Mock input for testing
    let inputIndex = 0;
    const mockInputs = ['Alice', '25'];

    interpreter.defaultInputHandler = async (prompt) => {
      const input = mockInputs[inputIndex];
      console.log(`Input: ${prompt} -> ${input}`);
      inputIndex++;
      return input;
    };

    // Collect outputs
    const outputs = [];
    for await (const output of interpreter.executeProgram(ast)) {
      console.log(`Output: ${output}`);
      outputs.push(output);
    }

    console.log('\n4. Test completed successfully!');
    console.log(`Total outputs: ${outputs.length}`);

  } catch (error) {
    console.error('Test failed:', error.message);
    console.error(error.stack);
  }
}

testInterpreter();