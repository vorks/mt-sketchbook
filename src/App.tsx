import React, { Component, ChangeEvent, RefObject, MouseEvent } from "react";
import Modal, { CloseOpenModalFunction } from "./Modal";
import PageListItem from "./PageListItem";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { Page } from "./types";
import "./App.css";
import Canvas, { OnMouseUp } from "./Canvas";

interface AppState {
  activePageId?: number;
  newPage: string;
  pages: Page[];
}

class App extends Component<{}, AppState> {
  state: AppState = { newPage: "", pages: [] };

  inputRef: RefObject<HTMLInputElement> = React.createRef();

  handleChange = (name: keyof AppState) => ({
    target: { value }
  }: ChangeEvent<HTMLInputElement>) => {
    this.setState(prevState => ({ ...prevState, [name]: value }));
  };

  handleMouseUp: OnMouseUp = imageData => {
    this.setState(({ pages, ...prevState }) => {
      if (typeof prevState.activePageId !== "undefined") {
        const index = prevState.activePageId || 0;

        const newPage = {
          ...pages[index],
          imageData
        };

        const newPages = [
          ...pages.slice(0, index),
          newPage,
          ...pages.slice(index + 1)
        ];

        return { ...prevState, pages: newPages };
      }

      return { pages, ...prevState };
    });
  };

  handleNewPageClick = (openModal: CloseOpenModalFunction) => () => {
    openModal(() => {
      if (this.inputRef.current) {
        this.inputRef.current.focus();
      }
    });
  };

  handlePageClick = (id: number) => () => {
    this.setState({ activePageId: id });
  };

  handleSubmit = (closeModal: CloseOpenModalFunction) => () => {
    this.setState(
      state => {
        const lastPage = state.pages[state.pages.length - 1];
        const newPage = {
          id: lastPage ? lastPage.id + 1 : 0,
          imageData: new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT),
          label: state.newPage
        };

        return {
          newPage: "",
          pages: [...state.pages, newPage]
        };
      },
      () => {
        closeModal();
        this.handlePageClick(this.state.pages.slice(-1)[0].id)();
      }
    );
  };

  render() {
    return (
      <div className="Container">
        <div>
          <div className="outline">
            <Modal
              render={({ openModal }) => (
                <button onClick={this.handleNewPageClick(openModal)}>
                  New Page
                </button>
              )}
            >
              {({ closeModal }) => (
                <div className="Form">
                  <input
                    type="text"
                    value={this.state.newPage}
                    onChange={this.handleChange("newPage")}
                    ref={this.inputRef}
                    required
                  />
                  <button onClick={this.handleSubmit(closeModal)}>
                    Create New Page
                  </button>
                </div>
              )}
            </Modal>
          </div>
          <div className="outline">
            <ul>
              {this.state.pages.map(({ id, label }) => (
                <PageListItem
                  key={id}
                  isActive={id === this.state.activePageId}
                  label={label}
                  onClick={this.handlePageClick(id)}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="CanvasContainer outline">
          {typeof this.state.activePageId !== "undefined" && (
            <Canvas
              imageData={this.state.pages[this.state.activePageId].imageData}
              onMouseUp={this.handleMouseUp}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
