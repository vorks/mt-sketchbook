import React, { Component, ReactNode, KeyboardEventHandler } from "react";
import "./Modal.css";

export type CloseOpenModalFunction = (callback?: () => void) => void;

interface ModalRenderProps {
  closeModal: CloseOpenModalFunction;
  openModal: CloseOpenModalFunction;
}

interface ModalProps {
  children(childrenProps: ModalRenderProps): ReactNode;
  render(renderProps: ModalRenderProps): ReactNode;
}

interface ModalState {
  open: boolean;
}

export default class Modal extends Component<ModalProps, ModalState> {
  state = { open: false };

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyUp = (ev: KeyboardEvent) => {
    if (ev.key === "Escape") {
      this.closeModal();
    }
  };

  closeModal: CloseOpenModalFunction = () => {
    this.setState({ open: false });
  };

  openModal: CloseOpenModalFunction = (callback?: () => void) => {
    this.setState({ open: true }, callback);
  };

  render() {
    const { closeModal, openModal } = this;

    return (
      <>
        {this.props.render({ closeModal, openModal })}
        {this.state.open && (
          <div
            className="ModalBackground"
            style={open ? {} : { display: "none" }}
            onClick={() => this.closeModal()}
          >
            <div
              className="Modal"
              onClick={event => {
                event.stopPropagation();
              }}
            >
              {this.props.children({ closeModal, openModal })}
            </div>
          </div>
        )}
      </>
    );
  }
}
