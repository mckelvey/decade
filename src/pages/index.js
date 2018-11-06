import { find } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';

class IndexPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '2008-12-06',
    };
  }

  renderDay() {
    const { currentDate } = this.state;
    const { edges } = this.props.data.allJson;
    const { node: day } = find(edges, item => item.node.date === currentDate);
    return (
      <div>
        <span className="count">{day.count}</span>
        <span className="date">{currentDate}</span>
      </div>
    );
  }

  render() {
    const { currentDate } = this.state;
    return (
      <Layout>
        <h1>Hi people</h1>
        <div data-date={currentDate} style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
          {this.renderDay()}
          <Image />
        </div>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.shape({
          count: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
          fill: PropTypes.string.isRequired,
        }).isRequired
      })
    ),
  }).isRequired,
};

export const query = graphql`
  query DecadeQuery {
    allJson(
      sort: {fields: [date], order: ASC},
    ) {
      edges {
        node {
          count
          date
          fill
        }
      }
    }
  }
`;

export default IndexPage;
