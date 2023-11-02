import * as React from 'react';
import { StylingState, StylingProps } from './StylingPropsState';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import styles from './ReactNewsWebpart.module.scss';
import EditNewsModal from './EditNewsModal';
import SPServices from './Service/SPServices';

export const iconClass = mergeStyles({
  fontSize: 15,
  height: 15,
  width: 15
});

export default class StackStyle extends React.Component<StylingProps, StylingState> {
  constructor(props: StylingProps) {
    super(props);
    this.state = {
      // News: [],
      News: new SPServices(this.props.context).getMockData(),
      RenderedNews: [],
      UpdateCount: 0,
      Next: 3,
      Count: 1,
      Reload: true,
      onEditNews: this.props.onEditNews,
      editedNews: null,
      showModal: false,
      modalWindowEnabled: this.props.modalWindowEnabled,
      updateImageUrl: this.props.updateImageUrl,
      imageUrl: '',
      propertyPaneTextFieldValue:this.props.propertyPaneTextFieldValue,
      renderedNews: [],
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

  public updateImageUrlInWebPart = (imageUrl: string, newsId: number,) => {
    if (this.props.updateImageUrl) {
      this.props.updateImageUrl(imageUrl, newsId);
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

  public handleSaveNews = (imageUrl: string, newsId: number) => {
    try {
      if (this.state.editedNews !== null) {
        const updatedNews = this.state.News.map(news => {
          if (news.Id === this.state.editedNews.Id) {
            return {
              ...news,
              // Thumbnail: imageUrl,
              BannerImageUrl:imageUrl ,
            };
          }
          return news;
        });
        this.setState(
          prevState => ({
          News: updatedNews,
          RenderedNews: updatedNews.slice(0, 3),
          showModal: false,
          editedNews: null,
        }),
        )
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
    var array = [];
    var count = 0;
    var min = this.state.Next;
    var max = min + 4;
    News.map(Post => {
      count = count + 1;
      if (count > min && count < max) {
        array.push(Post);
      }
    });
    var newVal = this.state.Next + 3;
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count + 1 });
  }

  public Back(News) {
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
    this.setState({ RenderedNews: array, Next: newVal, Count: this.state.Count - 1 });
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
    var Height: any;
    switch (this.state.RenderedNews.length) {
      case 1:
        Height = '246px';
        break;
      case 2:
        Height = '435px';
        break;
      case 3:
        Height = '624px';
        break;
    }
    return (
      <div className={styles.SingleStyle}>
        <div className={styles.SingleStyleContainer} style={{ height: Height }}>
          <div>

            {this.state.RenderedNews.map(Post => {
              //  const imageUrl = this.state.imageUrl || Post.Thumbnail || 'URL по умолчанию';
              const imageUrl = this.state.imageUrl || Post.BannerImageUrl || 'URL по умолчанию';
              return (
                <div className={styles.NewsContainer} style={{ boxShadow: 'rgb(0 0 0 / 16%) 0px 1px 4px, rgb(0 0 0 / 10%) 0px 0px 1px' }}>
                  <a href={Post.Url} className={styles.TitleStyling}>
                  <div className={styles.ImgContainer}>
                    <img
                      // src={Post.BannerImageUrl}
                      src={imageUrl || Post.BannerImageUrl}
                      // src={imageUrl || Post.Thumbnail}
                      className={styles.Image}
                      onClick={(event) => this.onNewsImageClick(event, Post.Id)}
                    ></img>
                  </div>
                  <div className={styles.NewsBody}>
                    <div className={styles.TitleContainer}>
                      <a className={styles.TitleStyling} href={Post.Url}  >{Post.Title}</a>
                    </div>
                    <div className={styles.DescriptionContainer}>{Post.Description}</div>
                    <div className={styles.AuthorContainer}>
                      {this.props.AuthorToggle ? <div></div> : Post.Author}
                      {/* Created {Post.Created} */}
                      {this.props.DateToggle ? (<div></div>) : (<div> {Post.Created} <br></br></div>)} {" "}
                    </div>
                  </div>
                  </a>
                </div>
              )

            })}
            <div className={styles.NavigationContainer} >
              <button
                disabled={this.state.Next === 3}
                style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
                className={styles.NavigationLeftButtonStyling}
                onClick={() => this.Back(this.props.News)}>Назад</button>
              <button
                disabled={this.state.Next >= this.props.News.length}
                style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 30%), 0 0 40px rgb(0 0 0 / 10%)' }}
                className={styles.NavigationRightButtonStyling}
                onClick={() => this.Next(this.props.News)}>Вперед</button>
              <div className={styles.NavigationPageNumStyling}>{this.state.Count} out of {Math.ceil(this.props.News.length / 3)}</div>
            </div>
          </div>
          {this.state.showModal && this.props.modalWindowEnabled && (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(180, 167, 167, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <EditNewsModal
                  onClose={this.handleCloseModal}
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
    )
  }
}
