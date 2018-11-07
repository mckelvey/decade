import delay from 'lodash/delay';
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Count from '../components/count';

class IndexPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    this.increment();
  }

  componentDidUpdate() {
    this.increment();
  }

  increment() {
    const { index } = this.state;
    const { totalCount } = this.props.data.allJson;
    if (index < totalCount - 1) {
      delay(
        () => this.setState({ index: index + 1 }),
        1
      );
    }
  }

  render() {
    const { index } = this.state;
    const { edges } = this.props.data.allJson;
    const { node: day } = edges[index];
    return (
      <Layout>
        <h1>Hi people</h1>
        <Count count={parseInt(day.count, 10) || 0} />
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allJson: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            count: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
          }).isRequired
        })
      ).isRequired,
      totalCount: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query DecadeRangeQuery {
    allJson(
      sort: {fields: [date], order: ASC},
    ) {
      totalCount
      edges {
        node {
          count
          date
        }
      }
    }
  }
`;

export default IndexPage;
