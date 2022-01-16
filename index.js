var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { GraphQLObjectType, GraphQLSchema } = require('graphql/type');
const { GraphQLList, GraphQLNonNull } = require('graphql/type/definition');
const {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require('graphql/type/scalars');

// Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String,
//     getItem: String
//   },
// `);

const todos = [
  {
    id: 1,
    title: 'Wash dishes',
    description: 'Get them clean.',
    isComplete: false,
  },
  {
    id: 2,
    title: 'Do laundry',
    description: 'Get them clean.',
    isComplete: false,
  },
  {
    id: 3,
    title: 'Clean bathroom',
    description: 'Get it clean.',
    isComplete: false,
  },
  {
    id: 4,
    title: 'Comb hair',
    description: 'Get them straight.',
    isComplete: false,
  },
];

// The root provides a resolver function for each API endpoint
var root = {
  todos: () => {
    description: resolve: () => todos;
  },
};

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  description: 'A task that needs to be done',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    isComplete: { type: GraphQLNonNull(GraphQLBoolean) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      description: 'List of all todos',
      resolve: () => todos,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addTodo: {
      type: TodoType,
      description: 'Adds a todo',
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        isComplete: { type: GraphQLNonNull(GraphQLBoolean) },
      },
      resolve: (parent, args) => {
        const todo = {
          id: todos.length + 1,
          title: args.title,
          description: args.description,
          isComplete: args.isComplete,
        };
        todos.push(todo);
        return todo;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

var app = express();
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/');

//todo item descriptiuon isComplete
