interface IMailConfig {
  driver: 'ethereal' | 'ses' | 'zoho';
  dafaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  dafaults: {
    from: {
      email: 'suporte@softwrap.com.br',
      name: 'SoftWrap',
    },
  },
} as IMailConfig;
