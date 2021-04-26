const { ipcRenderer } = require('electron');

/* JQUERY EXTENDS FUNCTIONS */
// form complex serialize
$.fn.serializeObject = function () {
  const objectData = {};
  $.each(this.serializeArray(), function () {
    const value = this.value !== undefined ? this.value : null;
    if (objectData[this.name] !== undefined) {
      if (!objectData[this.name].push) {
        objectData[this.name] = [objectData[this.name]];
      }
      objectData[this.name].push(value);
    } else {
      objectData[this.name] = value;
    }
  });
  return objectData;
};

const methods = {
  getBucketAccelerateConfiguration: [],
  getBucketAcl: [],
  getBucketAnalyticsConfiguration: ['Id'],
  getBucketCors: [],
  getBucketEncryption: [],
  getBucketIntelligentTieringConfiguration: ['Id'],
  getBucketInventoryConfiguration: ['Id'],
  getBucketLifecycle: [],
  getBucketLifecycleConfiguration: [],
  getBucketLocation: [],
  getBucketLogging: [],
  getBucketMetricsConfiguration: ['Id'],
  getBucketNotification: [],
  getBucketNotificationConfiguration: [],
  getBucketOwnershipControls: [],
  getBucketPolicy: [],
  getBucketPolicyStatus: [],
  getBucketReplication: [],
  getBucketRequestPayment: [],
  getBucketTagging: [],
  getBucketVersioning: [],
  getBucketWebsite: [],
}

const tableLang = {
  sEmptyTable: 'Nenhum registro encontrado',
  sInfo: 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
  sInfoEmpty: 'Mostrando 0 até 0 de 0 registros',
  sInfoFiltered: '(Filtrados de _MAX_ registros)',
  sInfoPostFix: '',
  sInfoThousands: '.',
  sLengthMenu: '_MENU_ resultados por página',
  sLoadingRecords: 'Carregando...',
  sProcessing: 'Processando...',
  sZeroRecords: 'Nenhum registro encontrado',
  sSearch: 'Pesquisar',
  oPaginate: {
    sNext: 'Próximo',
    sPrevious: 'Anterior',
    sFirst: 'Primeiro',
    sLast: 'Último',
  },
  oAria: {
    sSortAscending: ': Ordenar colunas de forma ascendente',
    sSortDescending: ': Ordenar colunas de forma descendente',
  },
};
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}
function syntaxHighlight(json) {
  if (typeof json !== 'string') json = JSON.stringify(json, undefined, 2);
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

// Form
$(document).on('submit', 'form', function (e) {
  const self = $(this);
  let btn = $(e.originalEvent.submitter);
  let content = btn.html();
  const inputs = self.find('input, textarea, button, select, .nav-item');
  btn.html('<i class="far fa-spinner-third fa-spin"></i> Aguarde');
  btn.attr('disabled', 'disabled');
  inputs.attr('readonly', true);
  if (typeof self.checkValidity === 'function') self.checkValidity();
  e.button = (ref, loading = true) => {
    btn = typeof ref === 'string' ? $(ref) : ref;
    content = btn.html();
    if (loading) {
      btn.html('<i class="far fa-spinner-third fa-spin"></i> Aguarde');
      btn.attr('disabled', 'disabled');
      inputs.attr('readonly', true);
    }
  };
  e.finish = () => {
    btn.html(content);
    btn.removeAttr('disabled');
    inputs.attr('readonly', false);
  };
});

// router
$('[href]').on('click', async function (e) {
  e.preventDefault();
  const url = $(this).attr('href');
  if (url === '#') return;
  ipcRenderer.invoke('router', url);
});

const modal = $('#modal-basic');
const modalTitle = modal.find('.modal-title');
const modalBody = modal.find('.modal-body');
const modalOk = modal.find('.modal-footer button:eq(1)');

const serviceStatus = $('#service-status');

const tableBuckets = $('#table-buckets');
const tableLambdas = $('#table-lambdas');
const t = tableBuckets.DataTable({ language: tableLang });
const t2 = tableLambdas.DataTable({ language: tableLang });

showDashboard = async () => {
  const res = await ipcRenderer.invoke('router', 'dashboard/services');
  serviceStatus.find('pre').html(res ? syntaxHighlight(res) : 'LocalStack não iniciado.');
}
showBuckets = async () => {
  t.clear().draw();
  (await ipcRenderer.invoke('router', 'bucket/list')).Buckets.forEach((item) => {
    t.row.add([
      item.Name,
      new Date(item.CreationDate).toLocaleDateString(),
      `
      <button type="button" class="btn btn-xs btn-default btn-addon" onclick="delteBucket('${item.Name}');">
        <i class="fad fa-trash"></i>
      </button>
      <button type="button" class="btn btn-xs btn-default btn-addon" onclick="configBucket('${item.Name}');">
        <i class="fad fa-info-circle"></i>
      </button>
      <button type="button" class="btn btn-xs btn-default btn-addon" data-toggle="modal" data-target="#modal-tree">
        <i class="fad fa-folder-tree"></i>
      </button>
      `,
    ]).draw();
  });
};
showLambdas = async () => {
  t2.clear().draw();
  (await ipcRenderer.invoke('router', 'lambda/list')).Functions.forEach((item) => {
    t2.row.add([
      item.FunctionName,
      item.Runtime,
      item.Handler,
      bytesToSize(item.CodeSize),
      bytesToSize(item.MemorySize * 1024 * 1024),
      item.PackageType,
      item.State,
      item.LastUpdateStatus,
      new Date(item.LastModified).toLocaleDateString(),
      `
      <button type="button" class="btn btn-xs btn-default btn-addon">
        <i class="fad fa-trash"></i>
      </button>
      <button type="button" class="btn btn-xs btn-default btn-addon">
        <i class="fad fa-info-circle"></i>
      </button>
      `,
    ]).draw();
  });
};
if (tableBuckets.length) showBuckets();
if (tableLambdas.length) showLambdas();
if (serviceStatus.length) showDashboard();

delteBucket = (name) => {
  modal.modal('hide');
  modalTitle.html('Deletar Bucket');
  modalBody.html(`Tem certeza que deseja deletar o bucket: ${name}?`);
  modalOk.on('click', async () => {
    modalOk.html('<i class="far fa-spinner-third fa-spin"></i> Aguarde');
    (await ipcRenderer.invoke('router', 'bucket/delete', name))
      ? toastr.warning('O bucket foi removido com sucesso!', 'Bucket')
      : toastr.error(`Não foi possível deletar o bucket: ${name}`, 'Bucket');
    showBuckets();
    modal.modal('hide');
  });
  modal.modal('show');
};
deleteAllBuckets = () => {
  modal.modal('hide');
  modalTitle.html('Deletar Buckets');
  modalBody.html('Tem certeza que deseja deletar todos os buckets?');
  modalOk.on('click', async () => {
    modalOk.html('<i class="far fa-spinner-third fa-spin"></i> Aguarde');
    (await ipcRenderer.invoke('router', 'bucket/deleteAll'))
      ? toastr.warning('Todos os buckets foram removidos com sucesso!', 'Bucket')
      : toastr.error('Não foi possível deletar todos os buckets!', 'Bucket');
    showBuckets();
    modal.modal('hide');
  });
  modal.modal('show');
};

$(document).on('submit', '#modal-add-bucket form', async function (e) {
  e.preventDefault();
  const self = $(this);
  (await ipcRenderer.invoke('router', 'bucket/create', self.serializeObject()))
    ? toastr.success('O bucket foi criado com sucesso!', 'Bucket')
    : toastr.error('Não foi possível criar o bucket!', 'Bucket');
  showBuckets();
  $('.modal').modal('hide');
  self.trigger('reset');
  e.finish();
});

configBucket = async function (bucket) {
  const self = $('#modal-bucket-config').modal('show');
  const form = self.find('.modal-body');
  const select = form.find('select');
  const submit = form.find('button[type="submit"]');
  const pre = form.find('pre');

  Object.keys(methods).forEach((a) => select.append(`<option value="${a}">${a}</option>`));

  select.on('change', async function () {
    const value = $(this).val();
    form.find('input').remove();
    methods[value].forEach((a) => {
      select.after(`<input type="text" class="form-control" name="${a}" placeholder="${a}">`);
    });
    submit.trigger('click');
  });

  $(document).on('submit', '', async (e) => {
    e.preventDefault();
    const data = form.serializeObject();
    const func = data.func;
    delete data.func; 
    data.Bucket = bucket;
    const res = await ipcRenderer.invoke('router', 'bucket/configs', func, data);
    pre.html(res ? syntaxHighlight(res) : 'Não configurado.');
    e.finish();
  });
};
