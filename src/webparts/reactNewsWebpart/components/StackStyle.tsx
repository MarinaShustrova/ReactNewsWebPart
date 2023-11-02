import * as React from "react";
import { StylingState, StylingProps } from "./StylingPropsState";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import styles from "./ReactNewsWebpart.module.scss";
import EditNewsModal from './EditNewsModal';
import SPServices from "./Service/SPServices";


export const iconClass = mergeStyles({
  fontSize: 15,
  height: 15,
  width: 15,
});

export default class StackStyle extends React.Component<StylingProps, StylingState> {
  constructor(props: StylingProps) {
    super(props);
    this.state = {
      // News: [],
      News: new SPServices(this.props.context).getMockData(),
      RenderedNews: [],
      renderedNews: [],
      UpdateCount: 0,
      Next: 3,
      Count: 1,
      Reload: true,
      onEditNews: this.props.onEditNews,
      editedNews: null,
      showModal: false,
      modalWindowEnabled: this.props.modalWindowEnabled,
      updateImageUrl: this.props.updateImageUrl,
      imageUrl: this.props.propertyPaneTextFieldValue,
      propertyPaneTextFieldValue: this.props.propertyPaneTextFieldValue,
      isUpdatingNews: false,
      currentPage: 1,
      selectedNewsImageUrl: '',
    };
  }


  public handleEditNews = (newsId: number) => {
    try {
      let newsToEdit = null;
      for (const news of this.state.News) {
        if (news.Id === newsId) {
          newsToEdit = news;
          break;
        }

      }
      this.setState({
        showModal: true,
        editedNews: newsToEdit,

      });

    } catch (error) {
      console.error('Error in handleEditNews:', error);
    }

  };

  private onNewsImageClick = (event: React.MouseEvent<HTMLImageElement>, newsId: number): void => {
    if (this.props.modalWindowEnabled === true && !this.state.isUpdatingNews) {
      this.handleEditNews(newsId);
      event.preventDefault();
    } else {
      console.log(`Modal window is disabled for news with ID ${newsId}`);
    }
  }

  public updateImageUrlInWebPart = (imageUrl: string, newsId: number,) => {
    if (this.props.updateImageUrl) {
      this.props.updateImageUrl(imageUrl, newsId);
    }
  };

  public handleSaveNews = (imageUrl: string, newsId: number) => {

    try {
      if (this.state.editedNews !== null) {
        const updatedNews = this.state.News.map(news => {
          if (news.Id === this.state.editedNews.Id) {
            return {
              ...news,
              BannerImageUrl: imageUrl,
              // Thumbnail: imageUrl
            };
          }
          return news;
        });
        this.setState(
          prevState => ({
            News: updatedNews,
            RenderedNews: prevState.RenderedNews.map(news => {
              if (news.Id === prevState.editedNews.Id) {
                return {
                  ...news,
                  BannerImageUrl: imageUrl,
                  // Thumbnail: imageUrl

                };
              }
              return news;
            }),
            showModal: false,
            editedNews: null,
          }),
        );
      } else {
        console.log('editedNews is null');
      }
    } catch (error) {
      console.error('An error occurred in handleSaveNews:', error);
    }
  }


  public handleCloseModal = () => {
    try {
      this.setState({
        showModal: false,
        editedNews: null,
      });
    } catch (error) {
      console.error('An error occurred in handleCloseModal:', error);
    }
  };


  public Next(News) {
    console.log('this.state.isUpdatingNews', this.state.isUpdatingNews);
    if (this.state.isUpdatingNews) {
      return;
    }
    var array = [];
    console.log('array', array);
    var count = 0;
    var min = this.state.Next;
    console.log('min', min);
    var max = min + 4;
    console.log('max', max);
    News.map((Post) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
        console.log('array after push', array);
      }
    });
    var newVal = this.state.Next + 3;
    this.setState({
      RenderedNews: array,
      Next: newVal,
      Count: this.state.Count + 1,
      currentPage: this.state.currentPage
    });
    console.log('setState', this.state.RenderedNews, this.state.currentPage);

  }

  public Back(News) {
    if (this.state.isUpdatingNews) {
      return;
    }
    var array = [];
    var max, min;
    min = this.state.Next - 6;
    max = this.state.Next - 2;
    var count = 0;
    News.map((Post) => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    var newVal = this.state.Next - 3;
    this.setState({
      RenderedNews: array,
      Next: newVal, Count: this.state.Count - 1,
    });
  }


  public componentDidMount() {
    this.setState({ imageUrl: this.props.propertyPaneTextFieldValue });
    var array = [];
    var count = 0;
    var min = 0;
    var max = min + 4;

    this.props.News.map(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: 0 });
  }

  public componentDidUpdate(prevProps: StylingProps) {
    if (this.props.propertyPaneTextFieldValue !== prevProps.propertyPaneTextFieldValue) {
      this.setState({ imageUrl: this.props.propertyPaneTextFieldValue });
    }
    var array = [];
    var count = 0;
    var min = 0;
    var max = min + 4;

    if (prevProps.News !== this.props.News) {
      this.props.News.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: 0 });
      return true;
    }
    else if (this.props.News.length > 0 && this.props.News.length > this.state.RenderedNews.length && this.state.UpdateCount < 4) {
      this.props.News.map(Post => {
        count = count + 1;
        if (count > min && count < max) {
          array.push(Post);
        }
      });
      this.setState({ RenderedNews: array, Next: 3, Count: 1, UpdateCount: this.state.UpdateCount + 1 });
      return true;
    }
  }

  public render(): React.ReactElement<StylingProps> {
    var i = 0;
    return (
      <div className={styles.StackStyle}>
        <div className={styles.StackStyleContainer}>
          <div>
            {this.state.RenderedNews.map((Post) => {
              // const imageUrl = this.state.imageUrl || Post.Thumbnail || 'URL по умолчанию';
              const imageUrl = this.state.imageUrl || Post.BannerImageUrl || 'URL по умолчанию';
              i = i + 1;
              return (
                <div
                  className={styles.NewsContainer}
                  style={{ boxShadow: 'rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px', marginRight: `${i === 3 ? '0px' : '7px'}` }}>
                  <a href={Post.Url} className={styles.TitleStyling} style={{ textDecoration: 'none', color: 'rgb(91, 83, 83)', cursor: 'auto' }}>
                    <div className={styles.ImgContainer}>
                      <img
                        // src={imageUrl}
                        src={imageUrl || Post.BannerImageUrl}
                        // src={imageUrl || Post.Thumbnail}
                        className={styles.Image}
                        onClick={(event) => this.onNewsImageClick(event, Post.Id)}
                      ></img>
                    </div>
                    <div className={styles.NewsBody}>
                      <div className={styles.TitleContainer}>
                        {/* <a className={styles.TitleStyling} href={Post.Url} > */}
                        {Post.Title}
                        {/* </a> */}
                      </div>
                      <div className={styles.DescriptionContainer}>
                        {Post.Description ? Post.Description.substring(0, 182) + '…' : '…'}
                      </div>
                      <div className={styles.AuthorContainer}>
                        {this.props.AuthorToggle ? (<div></div>) : (<div> {Post.Author} <br></br> </div>)}{" "}
                        {this.props.DateToggle ? (<div></div>) : (<div> {Post.Created} <br></br></div>)} {" "}
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
          <br></br>
          <div className={styles.NavigationContainer}>
            <button
              disabled={this.state.Next === 3}
              style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
              className={styles.NavigationLeftButtonStyling}
              onClick={() => this.Back(this.props.News)}>Back</button>
            <button
              disabled={this.state.Next >= this.props.News.length}
              style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
              className={styles.NavigationRightButtonStyling}
              onClick={() => this.Next(this.props.News)}>Next</button>
            <div className={styles.NavigationPageNumStyling}>{this.state.Count} out of {Math.ceil(this.props.News.length / 3)}</div>
          </div>
          {this.state.showModal && this.props.modalWindowEnabled && (
            <div className={styles.modalContainer}>
              <div className={styles.modalContent}>
                <EditNewsModal
                  onClose={this.handleCloseModal}
                  // onSave={this.handleSaveNews}
                  onSave={(imageUrl, newsId) => this.handleSaveNews(imageUrl, newsId)}
                  modalWindowEnabled={this.props.modalWindowEnabled}
                  // imageUrl={this.props.imageUrl}
                  imageUrl={this.state.selectedNewsImageUrl}
                  updateImageUrl={this.props.updateImageUrl}
                  newsId={this.state.editedNews ? this.state.editedNews.Id : 0}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}


