import { Application, Router, RouterContext } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql/mod.ts";

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

const types = gql`
type User {
  id: Int 
  first_name: String
  last_name: String
}

type UserOutput {
  id: Int 
}

type Query {
  fetchUser(id: Int): User 
}

type Mutation {
  insertUser(first_name: String!, last_name: String!): UserOutput!
}
`;

const resolvers = {
  Query: {
    fetchUser: (parent: any, { id }: any, context: any, info: any) => {
      // make database calls or http requests inside and return data
      return {
        id: 1,
        first_name: "Praveen",
        last_name: "Durairaju",
      };
    },
  },
  Mutation: {
    insertUser: (parent: any, { first_name, last_name }: any, context: any, info: any) => {
      console.log("input:", first_name, last_name);
      return {
        id: 1,
      };
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  context: (ctx: RouterContext) => {
    console.log(ctx);
    return { user: "Praveen" };
  }
})

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8090");
await app.listen({ port: 8090 });