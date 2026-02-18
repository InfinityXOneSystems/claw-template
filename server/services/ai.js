const axios = require('axios');

class AIService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
  }

  async generateCode(prompt, context = {}) {
    try {
      // Using OpenAI API for code generation
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert software engineer. Generate clean, efficient, and well-documented code.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        code: response.data.choices[0].message.content,
        model: response.data.model,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('Error generating code:', error.message);
      throw new Error('Failed to generate code');
    }
  }

  async analyzeCode(code, analysisType = 'general') {
    try {
      const prompts = {
        general: 'Analyze this code for quality, potential bugs, and improvements:',
        security: 'Perform a security analysis of this code:',
        performance: 'Analyze this code for performance issues:',
        refactor: 'Suggest refactoring improvements for this code:'
      };

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert code reviewer and analyzer.'
            },
            {
              role: 'user',
              content: `${prompts[analysisType]}\n\n${code}`
            }
          ],
          temperature: 0.5,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        analysis: response.data.choices[0].message.content,
        type: analysisType
      };
    } catch (error) {
      console.error('Error analyzing code:', error.message);
      throw new Error('Failed to analyze code');
    }
  }

  async chat(message, conversationHistory = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI coding assistant. Help users with coding tasks, debugging, and software development.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages,
          temperature: 0.8,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        message: response.data.choices[0].message.content,
        model: response.data.model
      };
    } catch (error) {
      console.error('Error in chat:', error.message);
      throw new Error('Failed to process chat message');
    }
  }

  async fixCode(code, error) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at debugging and fixing code. Provide corrected code with explanations.'
            },
            {
              role: 'user',
              content: `Fix this code that has the following error:\n\nError: ${error}\n\nCode:\n${code}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        fixedCode: response.data.choices[0].message.content,
        explanation: 'Code has been analyzed and fixed'
      };
    } catch (error) {
      console.error('Error fixing code:', error.message);
      throw new Error('Failed to fix code');
    }
  }

  async generateTests(code, framework = 'jest') {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert at writing unit tests using ${framework}.`
            },
            {
              role: 'user',
              content: `Generate comprehensive unit tests for this code:\n\n${code}`
            }
          ],
          temperature: 0.5,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        tests: response.data.choices[0].message.content,
        framework
      };
    } catch (error) {
      console.error('Error generating tests:', error.message);
      throw new Error('Failed to generate tests');
    }
  }
}

module.exports = new AIService();
