import {
  contactStatusColors,
  priorityColors
} from '../../utilities/colors';
import { emojiIcons } from '../../utilities/icons/Icons';
import {
  contactStatusOptions,
  leadSourceOptions,
  priorityOptions
} from './tableOptions';

export const getRandomKey = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const labelParent = (title, isSelected, icon, collapsed) => {
  return (
    <div
      className={
        isSelected
          ? 'side-nav-parent-list-item-selected'
          : 'side-nav-parent-list-item'
      }
    >
      <div
        className={
          isSelected
            ? 'side-nav-selected-represent'
            : 'side-nav-selected-represent-none'
        }
      ></div>
      <div
        className={
          isSelected
            ? 'side-nav-icon-wrapper-selected'
            : 'side-nav-icon-wrapper'
        }
      >
        {icon}
      </div>
      {collapsed ? <></> : <h4>{title}</h4>}
    </div>
  );
};

export const labelChild = (title, isSelected, icon, collapsed) => {
  return (
    <div
      className={
        isSelected
          ? collapsed
            ? 'side-nav-list-item-child-label-selected item-child-label-selected-padding'
            : 'side-nav-list-item-child-label-selected'
          : collapsed
          ? 'side-nav-list-item-child-label item-child-label-selected-padding'
          : 'side-nav-list-item-child-label'
      }
    >
      <div
        className={
          isSelected
            ? 'side-nav-list-item-child-dot'
            : 'side-nav-list-item-child-dot-none'
        }
      ></div>
      <div className="list-item-child-label-icon">{icon}</div>
      <h4>{title}</h4>
    </div>
  );
};

export const findTaskEmoji = id => {
  return emojiIcons.selectIcons?.find(icon => {
    return icon?.id === parseInt(id?.split('a')[0]);
  })?.icon;
};

export function stripHtml(html) {
  var temporalDivElement = document.createElement('div');
  temporalDivElement.innerHTML = html;
  return (
    temporalDivElement.textContent ||
    temporalDivElement.innerText ||
    ''
  );
}

export const copyToClipboard = async text => {
  var textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
};

export const findOptionLabelWithId = (arrayOfOptions, id) => {
  const name = arrayOfOptions.find(record => {
    return record?.value === id;
  }).label;

  return name;
};

export const findColorValue = value => {
  let data = null;
  let color = null;
  if (value in contactStatusColors) {
    data = 'contactStatus';
    color = contactStatusColors[value];
  } else if (value in priorityColors) {
    data = 'priorityId';
    color = {
      border: priorityColors[value],
      bgFill: priorityColors[value] + '1A'
    };
  } else {
    color = {
      border: '',
      bgFill: ''
    };
  }

  return color;
};

export const findTypeOfFilter = value => {
  let type = null;
  let status = null;
  if (
    contactStatusOptions?.find(data => {
      return data?.label === value;
    })
  ) {
    type = 'contactStatus';
    status = contactStatusOptions?.find(data => {
      return data?.label === value;
    });
  } else if (
    leadSourceOptions?.find(data => {
      return data?.label === value;
    })
  ) {
    type = 'leadSource';
    status = leadSourceOptions?.find(data => {
      return data?.label === value;
    });
  } else if (
    priorityOptions?.find(data => {
      return data?.label === value;
    })
  ) {
    type = 'priorityId';
    status = priorityOptions?.find(data => {
      return data?.label === value;
    });
  } else {
    type = 'none';
    status = {};
  }

  return { type, status };
};

// add changes in the row of table
export const spliceRow = (tableData, id, update) => {
  const newData = [...tableData];
  const index = newData.findIndex(item => id === item.id);
  const item = newData[index];
  newData.splice(index, 1, {
    ...item,
    ...update
  });

  return newData;
};

// decode the token for access
export function getJwtBody(jwt) {
  try {
    // Split the JWT into three parts: header, body, and signature
    const [header, body, signature] = jwt.split('.');
    // Base64 decode the body
    const decodedBody = JSON.parse(atob(body));
    return decodedBody;
  } catch (err) {
    console.error('Error decoding JWT body: ', err);
    return null;
  }
}

export function getProjectBoardName(projectBoard, selectedCardDetails) {
  if (projectBoard && selectedCardDetails) {
    const board = projectBoard?.find(board =>
      board?.cards?.some(
        card => card.id === selectedCardDetails.id
      )
    );
    return board ? board?.name : '';
  }
  return '';
};
export function isColorDark(hexColor) {
  if (!hexColor) return false; 
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 170;
};