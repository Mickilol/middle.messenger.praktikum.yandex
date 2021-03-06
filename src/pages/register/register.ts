import { Field } from 'components';
import Block from 'core/Block';
import { connect } from 'core/connect';
import { AppState } from 'store/types';
import { PageUrl } from 'utils/urls';
import { ValidationRule } from 'utils/validator';
import authService from 'services/auth';

import './register.scss';

interface IOwnProps {
  handleButtonClick: (e: SubmitEvent) => void;
}

interface IStateToProps {
  registerError?: string;
  isLoading: boolean;
}

type IProps = IOwnProps & IStateToProps;

interface IState {
  values: Record<keyof IRefs, string>;
}

interface IRefs {
  email: Field;
  login: Field;
  first_name: Field;
  second_name: Field;
  phone: Field;
  password: Field;
  password_repeat: Field;
}

class Register extends Block<IProps, IState, IRefs> {
  constructor(props: IProps) {
    super(props);

    this.setProps({
      handleButtonClick: this.handleButtonClick
    });
  }

  protected getStateFromProps(): void {
    this.state = {
      values: {
        email: '',
        login: '',
        first_name: '',
        second_name: '',
        phone: '',
        password: '',
        password_repeat: '',
      }
    };
  }

  private get refsKeys(): Array<keyof IRefs> {
    return Object.keys(this.refs) as Array<keyof IRefs>;
  }

  private isFormInvalid = (): boolean => {
    this.refsKeys.forEach(key => {
      this.refs[key].validate();
    });

    let hasErrors = this.refsKeys.some(key => this.refs[key].getError());

    if (this.refs.password.getValue() !== this.refs.password_repeat.getValue()) {
      hasErrors = true;
      this.refs.password_repeat.showError('Пароли не совпадают');
    }

    return hasErrors;
  };

  private handleButtonClick = (e: SubmitEvent) => {
    e.preventDefault();

    if (this.isFormInvalid()) {
      return;
    }

    const values: Record<keyof IRefs, string> = this.refsKeys.reduce((acc, key: keyof IRefs) => {
      acc[key] = this.refs[key].getValue();

      return acc;
    }, {} as Record<keyof IRefs, string>);

    this.setState({ values });

    authService.register(values);
  };

  render() {
    return `
      <main class="register__wrapper">
        <div class="register__card">
          <h1 class="register__title">
            Регистрация
          </h1>
      
          <form name="registerForm" class="register__form">
            {{{Field 
              type="email"
              name="email"
              value=values.email
              label="Почта"
              validationRule="${ValidationRule.EMAIL}"
              ref="email"
            }}}
      
            {{{Field 
              type="text"
              name="login"
              value=values.login
              label="Логин"
              validationRule="${ValidationRule.LOGIN}"
              ref="login"
            }}}
      
            {{{Field 
              type="text"
              name="first_name"
              value=values.first_name
              label="Имя"
              validationRule="${ValidationRule.NAME}"
              ref="first_name"
            }}}
      
            {{{Field 
              type="text"
              name="second_name"
              value=values.second_name
              label="Фамилия"
              validationRule="${ValidationRule.NAME}"
              ref="second_name"
            }}}
      
            {{{Field 
              type="tel"
              name="phone"
              value=values.phone
              label="Телефон"
              validationRule="${ValidationRule.PHONE}"
              ref="phone"
            }}}
      
            {{{Field 
              type="password"
              name="password"
              value=values.password
              label="Пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password"
            }}}
      
            {{{Field 
              type="password" 
              name="password_repeat"
              value=values.password_repeat
              label="Пароль (еще раз)"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password_repeat"
            }}}
      
            <div class="register__actions">
              {{{Button type="submit" text="Зарегистрироваться" onClick=handleButtonClick isLoading=isLoading }}}
              {{{Error text=registerError }}}
      
              {{{Link href="${PageUrl.LOGIN}" text="Войти" }}}
            </div>
          </form>
        </div>
      </main>
    `;
  }
}

export default connect(Register, ({ registerError, isLoading }: AppState): IStateToProps => ({ registerError, isLoading }));