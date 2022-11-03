import { gql } from "@apollo/client";

import { REPO_INFO, REVIEW_INFO } from "./fragments";

export const GET_REPOSITORIES = gql`
  query getRepositories(
    $orderDirection: OrderDirection
    $orderBy: AllRepositoriesOrderBy
    $searchKeyword: String
    $after: String
    $first: Int
  ) {
    repositories(
      orderDirection: $orderDirection
      orderBy: $orderBy
      searchKeyword: $searchKeyword
      after: $after
      first: $first
    ) {
      edges {
        node {
          ...RepoInfo
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${REPO_INFO}
`;

export const GET_REPO = gql`
  query getRepo($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      ...RepoInfo
      reviews(first: $first, after: $after) {
        edges {
          node {
            ...ReviewInfo
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${REPO_INFO}
  ${REVIEW_INFO}
`;

export const GET_USER = gql`
  query getCurrentUser(
    $includeReviews: Boolean = false
    $first: Int
    $after: String
  ) {
    me {
      id
      username
      reviews(first: $first, after: $after) @include(if: $includeReviews) {
        edges {
          node {
            ...ReviewInfo
            repository {
              fullName
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${REVIEW_INFO}
`;
