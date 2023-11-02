import * as React from 'react';
import styles from './ReactNewsWebpart.module.scss';

export interface IEditNewsModalProps {
  onClose: () => void;
  onSave: (imageUrl: string, newsId: number) => void;
  modalWindowEnabled: boolean;
  imageUrl: string;
  updateImageUrl: (imageUrl: string, newsId: number) => void;
  newsId: number;
}

export interface IEditNewsModalState {
  imageUrl: string;
}

export default class EditNewsModal extends React.Component<IEditNewsModalProps, IEditNewsModalState> {
  constructor(props: IEditNewsModalProps) {
    super(props);
    this.state = {
      // imageUrl: '',
      imageUrl: this.props.imageUrl,
    };
  }

  public handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ imageUrl: event.target.value });
  };

  public handleSave = () => {
    this.props.onSave(this.state.imageUrl, this.props.newsId);
    this.props.onClose();
    this.props.updateImageUrl(this.state.imageUrl, this.props.newsId)
  }

  render() {
    if (!this.props.modalWindowEnabled) {
      return null;
    }
    return (
      <div className={styles.modalContainer} style ={{ position: 'fixed', top:'0', left:'0', width:'100%', height:'100%', background:'rgba(148,147,147,0.4', display:'flex', justifyContent:'center', alignItems:'center',padding:'35px'}}>
        <div className={styles.modalContent} style={{ background: 'white',  borderRadius: '5px',padding:'25px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2', textAlign:'center'}}>
         <div style={{  fontFamily: 'Segoe UI',  color:'rgb(92,82,82)', fontSize:'14px', marginBottom: '25px' }} className={styles.title}> <h2 >Редактировать картинку для отображаения</h2></div>
          <input
            type="text"
            placeholder="Введите URL изображения"
            value={this.state.imageUrl}
            onChange={this.handleImageUrlChange}
            className={styles.inputModal}
            style={{  width: '85%', padding: '10px', marginBottom: '10px', border:'1px solid #ccc',borderRadius:'3px' }}
          />
          <button onClick={this.handleSave} style={{ backgroundColor: '#1655A3', color: 'white', dispalay: 'block', alignItems: 'center', justifyContent: 'center', height: '40px', width: '120px', marginTop: '10px', marginRight: '25px', marginLeft: '25px', textDecoration:'none' }}  className={`${styles["modal-buttons"]} ${styles["modal-button"]} ${styles["modal-button-primary"]}${styles["modal-button-secondary"]}`}>Сохранить</button>
          <button onClick={this.props.onClose} style={{ backgroundColor: '#1655A3', color: 'white', dispalay: 'block', alignItems: 'center', justifyContent: 'center', height: '40px', width: '120px', marginTop: '10px', marginRight: '25px',marginLeft: '25px' ,textDecoration:'none'}}  className={`${styles["modal-buttons"]} ${styles["modal-button"]} ${styles["modal-button-primary"]}${styles["modal-button-secondary"]}`} >Отменить</button>
        </div>
      </div>
    );
  }
}
