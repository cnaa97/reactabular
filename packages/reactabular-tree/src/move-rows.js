import findIndex from 'lodash/findIndex';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { moveRows } from 'reactabular-dnd';

const moveTreeRows = ({
  sourceRowId,
  targetRowId,
  retain = [],
  idField = 'id',
  parentField = 'parent'
} = {}) => (rows) => {
  let movedRows = moveRows({
    sourceRowId,
    targetRowId
  })(rows);

  if (movedRows) {
    // Walk through the old row definition, patch parent relations and fields
    // of the new one
    movedRows = rows.map((row, i) => {
      if (typeof row[parentField] === 'undefined') {
        return {
          ...omit(movedRows[i], retain),
          ...pick(row, retain),
          [idField]: movedRows[i][idField],
          [parentField]: undefined
        };
      }

      // Find the index of the old parent
      const index = findIndex(rows, {
        [idField]: row[parentField]
      });

      // Figure out the new id based on that index
      const id = movedRows[index][idField];

      return {
        ...omit(movedRows[i], retain),
        ...pick(row, retain),
        [idField]: movedRows[i][idField],
        [parentField]: id
      };
    });
  }

  return movedRows;
};

export default moveTreeRows;