import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import c from 'classnames';
import { Link } from 'react-router-dom';
import { status } from 'Constants/publishModes';
import { Icon, Dropdown, DropdownItem } from 'UI';
import { stripProtocol } from 'Lib/urlHelper';

export default class EditorToolbar extends React.Component {
  static propTypes = {
    isPersisting: PropTypes.bool,
    onPersist: PropTypes.func.isRequired,
    onPersistAndNew: PropTypes.func.isRequired,
    enableSave: PropTypes.bool.isRequired,
    showDelete: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDeleteUnpublishedChanges: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    user: ImmutablePropTypes.map,
    hasChanged: PropTypes.bool,
    displayUrl: PropTypes.string,
    collection: ImmutablePropTypes.map.isRequired,
    hasWorkflow: PropTypes.bool,
    hasUnpublishedChanges: PropTypes.bool,
    isNewEntry: PropTypes.bool,
    isModification: PropTypes.bool,
    currentStatus: PropTypes.string,
  };

  renderSimpleSaveControls = () => {
    const { showDelete, onDelete } = this.props;
    return (
      <div>
        {
          showDelete
            ? <button className="nc-entryEditor-toolbar-deleteButton" onClick={onDelete}>
                Delete
              </button>
            : null
        }
      </div>
    );
  };

  renderSimplePublishControls = () => {
    const { onPersist, onPersistAndNew, isPersisting } = this.props;
    return (
      <div>
        <Dropdown
          dropdownTopOverlap="40px"
          dropdownWidth="150px"
          label={isPersisting ? 'Publishing...' : 'Publish'}
        >
          <DropdownItem label="Publish now" icon="arrow" iconDirection="right" onClick={onPersist}/>
          <DropdownItem label="Publish and create new" icon="add" onClick={onPersistAndNew}/>
        </Dropdown>
      </div>
    );
  };

  renderWorkflowSaveControls = () => {
    const {
      onPersist,
      onDelete,
      onDeleteUnpublishedChanges,
      hasChanged,
      hasUnpublishedChanges,
      isNewEntry,
      isModification,
    } = this.props;

    const deleteLabel = (hasUnpublishedChanges && isModification && 'Delete unpublished changes')
      || (hasUnpublishedChanges && isNewEntry && 'Delete unpublished entry')
      || (!hasUnpublishedChanges && !isModification && 'Delete published entry');

    return (
      <div>
        <button onClick={() => hasChanged && onPersist()}>Save</button>
        {
          isNewEntry
            ? null
            : <button onClick={hasUnpublishedChanges ? onDeleteUnpublishedChanges : onDelete}>
                {deleteLabel}
              </button>
        }
      </div>
    );
  };

  renderWorkflowPublishControls = () => {
    const {
      onPersist,
      onPersistAndNew,
      isPersisting,
      onChangeStatus,
      onPublish,
      currentStatus,
      isNewEntry,
    } = this.props;
    if (currentStatus) {
      return [
        <Dropdown
          className="nc-entryEditor-toolbar-button"
          dropdownTopOverlap="40px"
          dropdownWidth="150px"
          label={isPersisting ? 'Updating...' : 'Set status'}
        >
          <DropdownItem
            className={c({
              'nc-entryEditor-toolbar-statusMenu-statusActive': currentStatus === status.get('DRAFT'),
            })}
            label="Draft"
            onClick={() => onChangeStatus('DRAFT')}
          />
          <DropdownItem
            className={c({
              'nc-entryEditor-toolbar-statusMenu-statusActive': currentStatus === status.get('PENDING_REVIEW'),
            })}
            label="In review"
            onClick={() => onChangeStatus('PENDING_REVIEW')}
          />
          <DropdownItem
            className={c({
              'nc-entryEditor-toolbar-statusMenu-statusActive': currentStatus === status.get('PENDING_PUBLISH'),
            })}
            label="Ready"
            onClick={() => onChangeStatus('PENDING_PUBLISH')}
          />
        </Dropdown>,
        <Dropdown
          className="nc-entryEditor-toolbar-button"
          dropdownTopOverlap="40px"
          dropdownWidth="150px"
          label={isPersisting ? 'Publishing...' : 'Publish'}
        >
          <DropdownItem label="Publish now" icon="arrow" iconDirection="right" onClick={onPublish}/>
          <DropdownItem label="Publish and create new" icon="add" onClick={onPersistAndNew}/>
        </Dropdown>
      ];
    }

    if (!isNewEntry) {
      return 'Published';
    }
  };



  render() {
    const {
      isPersisting,
      onPersist,
      onPersistAndNew,
      enableSave,
      showDelete,
      onDelete,
      user,
      hasChanged,
      displayUrl,
      collection,
      hasWorkflow,
      hasUnpublishedChanges,
    } = this.props;
    const disabled = !enableSave || isPersisting;
    const avatarUrl = user.get('avatar_url');

    return (
      <div className="nc-entryEditor-toolbar">
        <Link to={`/collections/${collection.get('name')}`} className="nc-entryEditor-toolbar-backSection">
          <div className="nc-entryEditor-toolbar-backArrow">←</div>
          <div>
            <div className="nc-entryEditor-toolbar-backCollection">
              Writing in <strong>{collection.get('label')}</strong> collection
            </div>
            {
              hasChanged
               ? <div className="nc-entryEditor-toolbar-backStatus-hasChanged">Unsaved Changes</div>
               : <div className="nc-entryEditor-toolbar-backStatus">Changes saved</div>
            }
          </div>
        </Link>
        <div className="nc-entryEditor-toolbar-mainSection">
          <div className="nc-entryEditor-toolbar-mainSection-left">
            { hasWorkflow ? this.renderWorkflowSaveControls() : this.renderSimpleSaveControls() }
          </div>
          <div className="nc-entryEditor-toolbar-mainSection-right">
            { hasWorkflow ? this.renderWorkflowPublishControls() : this.renderSimplePublishControls() }
          </div>
        </div>
        <div className="nc-entryEditor-toolbar-metaSection">
          {
            displayUrl
              ? <a className="nc-appHeader-siteLink" href={displayUrl} target="_blank">
                  {stripProtocol(displayUrl)}
                </a>
              : null
          }
          <button className="nc-appHeader-avatar">
            {
              avatarUrl
                ? <img className="nc-appHeader-avatar-image" src={user.get('avatar_url')}/>
                : <Icon className="nc-appHeader-avatar-placeholder" type="user" size="large"/>
            }
          </button>
        </div>
      </div>
    );
  }
};
