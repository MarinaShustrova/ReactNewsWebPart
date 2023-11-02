import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface StylingState {
  News: any[];
  RenderedNews: any[];
  UpdateCount: number;
  Next: number;
  Count: number;
  Reload: boolean;
  onEditNews: (newsId: number, imageUrl: string) => void;
  editedNews:any;
  imageUrl: string;
  showModal: boolean
  modalWindowEnabled: boolean;
  updateImageUrl: (imageUrl: string, newsId:number) => void;
  propertyPaneTextFieldValue: string;
  renderedNews: any[];
  isUpdatingNews: boolean,
  currentPage: number;
  selectedNewsImageUrl: string;
}

export interface StylingProps {
  News: any[];
  AuthorToggle: string;
  DateToggle : string;
  Reload: boolean;
  onEditNews: (newsId: number,imageUrl: string) => void;
  showModal: boolean,
  modalWindowEnabled: boolean;
  updateImageUrl: (imageUrl: string, newsId:number) => void;
  imageUrl: string;
  context: WebPartContext;
  propertyPaneTextFieldValue: string;
  selectedNewsImageUrl: string;
}
