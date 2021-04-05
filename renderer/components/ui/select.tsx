import { styled } from '@/styles';
import { useButton } from '@react-aria/button';
import { useComboBox } from '@react-aria/combobox';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useFilter } from '@react-aria/i18n';
import { useListBox, useOption } from '@react-aria/listbox';
import {
  DismissButton,
  OverlayContainer,
  useModal,
  useOverlay,
  useOverlayPosition,
  useOverlayTrigger,
} from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { Item } from '@react-stately/collections';
import { ComboBoxState, useComboBoxState } from '@react-stately/combobox';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { Node } from '@react-types/shared';
import * as React from 'react';
import CancelButton from './cancel-button';
import BaseButton from './button';
import Icon from './icon';
import Input from './input';

// @ts-ignore
const SelectTriggerContext = React.createContext<{
  overlayTriggerState: OverlayTriggerState;
}>();

interface BaseItem {
  id: string;
  name: string;
}

interface SelectProps<Item extends BaseItem> {
  searchPlaceholder?: string;
  items: Item[];
  getOptionLabel: (item: Item) => string;
  renderItem?: (item: Item) => React.ReactNode;
  selectedKey?: Item['id'];
  onSelectionChange: (key: Item['id']) => void;
  onInputChange?: (value: string) => void;
}

export const Select = <Item extends BaseItem = BaseItem>({
  searchPlaceholder,
  items,
  getOptionLabel,
  renderItem = getOptionLabel,
  selectedKey,
  onSelectionChange,
  onInputChange,
}: SelectProps<Item>) => {
  const { overlayTriggerState } = React.useContext(SelectTriggerContext);
  const listBoxRef = React.useRef<HTMLUListElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const fakeTriggerRef = React.useRef<HTMLButtonElement>(null);

  const itemChildren = React.useCallback(
    (item: Item) => (
      <Item textValue={getOptionLabel(item)}>{renderItem(item)}</Item>
    ),
    []
  );

  const [searchInputval, changeSearchInputVal] = React.useState('');
  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({
    defaultFilter: contains,
    children: itemChildren,
    selectedKey,
    onSelectionChange: (key: React.Key) => {
      onSelectionChange(key as Item['id']);

      // Click anywhere triggers onSelectionChange..
      if (key !== selectedKey) {
        overlayTriggerState.close();
      }
    },
    defaultItems: items,
    menuTrigger: 'manual',
    inputValue: searchInputval,
    onInputChange: (value) => {
      changeSearchInputVal(value);
      onInputChange && onInputChange(value);
    },
  });
  const { inputProps, listBoxProps: comboBoxListProps } = useComboBox(
    {
      // @ts-ignore
      'aria-label': 'Select',
      inputRef: searchInputRef,
      buttonRef: fakeTriggerRef,
      listBoxRef,
      popoverRef: menuRef,
      children: itemChildren,
      autoFocus: true,
    },
    state
  );

  const { listBoxProps } = useListBox(
    {
      ...comboBoxListProps,
      autoFocus: state.focusStrategy || true,
      disallowEmptySelection: true,
      // @ts-ignore
      shouldUseVirtualFocus: true,
    },
    state,
    listBoxRef
  );

  return (
    <SelectContainer>
      <SearchInputContainer>
        <SearchInput
          {...inputProps}
          ref={searchInputRef}
          placeholder={searchPlaceholder}
        />
        {searchInputval && (
          <CancelButton
            onClick={() => {
              changeSearchInputVal('');
              searchInputRef.current?.focus();
            }}
            label="Clear search"
            css={{
              position: 'absolute',
              top: '50%',
              right: '$space$2',
              transform: 'translateY(-50%)',
              size: '$8',
            }}
          />
        )}
      </SearchInputContainer>

      <OptionsMenu ref={menuRef}>
        <OptionsUl
          {...mergeProps(listBoxProps, comboBoxListProps)}
          ref={listBoxRef}
        >
          {[...state.collection].map((item) => (
            <Option key={item.key} item={item} state={state} />
          ))}
        </OptionsUl>
      </OptionsMenu>
    </SelectContainer>
  );
};

const SelectContainer = styled('div', {
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  height: '100%',
  py: '$2',
});

const SearchInputContainer = styled('div', {
  position: 'relative',
});
const SearchInput = styled(Input, {
  width: 'calc(100% - $space$4)',
  mx: '$2',
  pr: '$7',
  '&:focus-visible': {
    boxShadow: '0 0 0 1px $colors$border',
  },
});

const OptionsMenu = styled('div', {
  overflowX: 'hidden',
  overflowY: 'auto',
  mt: '$2',
  maxHeight: 'calc(100% - $space$2)',
});

const OptionsUl = styled('ul', {
  width: '100%',
  m: '0',
  p: '0',
  listStyle: 'none',
});

const Option: React.FC<{
  item: Node<BaseItem>;
  state: ComboBoxState<BaseItem>;
}> = ({ item, state }) => {
  const optionRef = React.useRef<HTMLLIElement>(null);

  const isDisabled = state.disabledKeys.has(item.key);
  const isSelected = state.selectionManager.isSelected(item.key);
  const isFocused = state.selectionManager.focusedKey === item.key;

  const { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      shouldUseVirtualFocus: true,
    },
    state,
    optionRef
  );

  return (
    <OptionLi
      {...optionProps}
      ref={optionRef}
      focused={isFocused}
      selected={isSelected}
    >
      {item.rendered}
    </OptionLi>
  );
};

const OptionLi = styled('li', {
  outline: 'none',
  px: '$4',
  py: '$1',
  transition: 'all 0.2s',

  variants: {
    focused: {
      true: {
        bg: '$bg_hover',
      },
    },
    selected: {
      true: {
        bg: '$spotify !important',
        color: '#000',
        fontWeight: '$bold',
      },
    },
  },
});

interface SelectTriggerProps {
  id?: string;
  selectedText?: string | null;
  placeholder?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  id,
  selectedText,
  placeholder = 'Select option',
  children,
}) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const state = useOverlayTriggerState({});
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'bottom',
    offset: 5,
    isOpen: state.isOpen,
  });
  const { buttonProps } = useButton(
    {
      onPress: () => state.toggle(),
    },
    triggerRef
  );

  return (
    <>
      <TriggerButton
        {...buttonProps}
        {...triggerProps}
        ref={triggerRef}
        id={`${id}-trigger`}
        aria-labelledby={`${id}-label ${id}-val`}
        selected={!!selectedText}
      >
        <span id={`${id}-val`}>{selectedText || placeholder}</span>

        <Icon>
          <polyline points="6 9 12 15 18 9"></polyline>
        </Icon>
      </TriggerButton>

      <SelectTriggerContext.Provider value={{ overlayTriggerState: state }}>
        {state.isOpen && (
          <OverlayContainer>
            <SelectPopover
              {...overlayProps}
              {...positionProps}
              overlayRef={overlayRef}
              triggerRef={triggerRef}
              isOpen={state.isOpen}
              onClose={state.close}
            >
              {children}
            </SelectPopover>
          </OverlayContainer>
        )}
      </SelectTriggerContext.Provider>
    </>
  );
};

const TriggerButton = styled(BaseButton, {
  width: '100%',
  height: '$10',
  px: '$3',
  justifyContent: 'space-between',
  borderWidth: '1px',
  variants: {
    selected: {
      true: {
        color: '$spotify',
      },
      false: {
        fontWeight: '$normal',
      },
    },
  },
});

interface SelectPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({
  isOpen,
  onClose,
  overlayRef,
  triggerRef,
  style,
  children,
  ...otherProps
}) => {
  const [shouldChildrenRender, setChildrenRender] = React.useState(false);

  const { overlayProps } = useOverlay(
    {
      onClose,
      isOpen,
      isDismissable: true,
    },
    overlayRef
  );
  const { modalProps } = useModal();
  const { dialogProps } = useDialog({}, overlayRef);

  /**
   * Select mounting in Popover was breaking the 1st open (immediatelly closing it)
   * This hack renders children (Select) in the next pass
   */
  React.useEffect(() => {
    setChildrenRender(true);
  }, []);

  return (
    <FocusScope restoreFocus>
      <PopoverContainer
        {...mergeProps(overlayProps, dialogProps, otherProps, modalProps)}
        ref={overlayRef}
        style={{
          ...style,
          width: triggerRef.current?.getBoundingClientRect().width || '280px',
        }}
      >
        {shouldChildrenRender ? children : null}

        <DismissButton onDismiss={onClose} />
      </PopoverContainer>
    </FocusScope>
  );
};

const PopoverContainer = styled('div', {
  borderWidth: '1px',
  borderRadius: '$sm',
  minWidth: '280px',
  maxWidth: '400px',
  minHeight: '200px',
  height: '400px',
  maxHeight: '400px',
  bg: '$bg_popover',
  outline: 'none',
});
