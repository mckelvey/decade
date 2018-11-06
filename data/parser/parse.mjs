import { basename, dirname } from 'path';
import { readdir, readFile, writeFile } from 'fs';
import _ from 'lodash';
import parser from 'fast-xml-parser';

const __dirname = dirname(new URL(import.meta.url).pathname);
const svgFolder = `${__dirname}/../svg`;
const jsonFolder = `${__dirname}/../json`;

const dateInRange = (dateString, yearMatcher) => {
  if (!dateString) {
    return false;
  }
  const [year, month, day] = dateString.split('-');
  if (!yearMatcher.test(dateString)) {
    return false;
  }
  if (year === '2008') {
    if (month !== '12' || parseInt(day, 10) < 6) {
      return false;
    }
  }
  return true;
};

const collectData = (jsObject, yearMatcher) => _.reduce(
  jsObject.svg.g.g,
  (result, g) => {
    if (g.rect) {
      _.forEach(g.rect, rect => {
        if (dateInRange(rect['data-date'], yearMatcher)) {
          result.push({
            fill: rect.fill,
            count: rect['data-count'],
            date: rect['data-date'],
          });
        }
      });
    }
    return result;
  },
  []
);

readdir(svgFolder, (error, items) => {
  if (error) {
    throw error;
  }
  _.forEach(items, item => {
    const fileYear = basename(item, '.svg');
    const yearMatcher = new RegExp(`^${fileYear}-`, '');
    readFile(`${svgFolder}/${fileYear}.svg`, (error, XMLData) => {
      if (error) {
        throw error;
      }
      const jsObject = parser.parse(
        XMLData.toString(), {
          attributeNamePrefix: '',
          ignoreAttributes: false,
        }
      );
      const data = collectData(jsObject, yearMatcher);
      writeFile(
        `${jsonFolder}/y${fileYear}.json`,
        JSON.stringify(data),
        error => {
          if (error) {
            throw error;
          }
          console.log(`${fileYear} converted`);
        }
      );
    });
  });
});
