<template>
  <div id="invoice">
    <div class="invoice_1">
      <h3>发票类型</h3>
      <ul>
        <li :class="{active:invoiceForm.invoiceForm<0}" @click="invoiceForm.invoiceForm=-1">不开发票</li>
        <li :class="{active:invoiceForm.invoiceForm==1}" @click="checkInvoice1">电子普通发票</li>
        <li :class="{active:invoiceForm.invoiceForm==0,disabled:commodityTemplateId!=7&&commodityTemplateId!=2}" @click="checkInvoice(0)" v-if="isDetailStore==0">纸质普通发票</li>
        <li :class="{active:invoiceForm.invoiceForm==2,disabled:commodityTemplateId!=7&&commodityTemplateId!=2}" @click="checkInvoice(2)" v-if="isDetailStore==0">增值税专用发票</li>
      </ul>
      <span v-if="commodityTemplateId!=7&&commodityTemplateId!=2">如果您需要开具纸质发票,请联系客服 021-34788330</span>
    </div>

    <div class="invoice_2" v-if="invoiceForm.invoiceForm>=0">
      <h3>发票抬头</h3>
      <ul>
        <li @click="invoiceForm.invoiceTitleType=0;invoiceForm.title='';" v-if="invoiceForm.invoiceForm!=2">
          <i :class="{'icon-round':invoiceForm.invoiceTitleType!=0,'icon-roundcheckfill':invoiceForm.invoiceTitleType==0}" class="iconfont"></i>
          <span>个人</span>
        </li>
        <li @click="invoiceForm.invoiceTitleType=1;invoiceForm.title='';">
          <i :class="{'icon-round':invoiceForm.invoiceTitleType==0,'icon-roundcheckfill':invoiceForm.invoiceTitleType!=0}" class="iconfont"></i>
          <span>单位</span>
        </li>
      </ul>
    </div>

    <div class="invoice_3" v-if="invoiceForm.invoiceForm>=0">
      <input type="text" class="cell_input" v-if="invoiceForm.invoiceTitleType==0" v-model="invoiceForm.title" placeholder="请输入“个人”或姓名">

      <!--<span class="cell_input selectTitle" v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length==0 && invoiceForm.invoiceForm!=2" @click="editInvoice(0)">添加单位抬头</span>-->
      <span class="cell_input selectTitle" v-if="invoiceForm.invoiceTitleType!=0 && (invoiceInfos.length==0||(invoiceForm.invoiceForm==2 && selectInvoiceInfo.isFullInfo!=1))" @click="editInvoice(0)">添加单位抬头</span>
      <!--<span class="cell_input selectTitle" v-if="invoiceForm.invoiceForm==2 && selectInvoiceInfo.isFullInfo!=1" @click="editInvoice(0)">选择单位抬头</span>-->
      <b v-if="(invoiceForm.invoiceTitleType!=0 && invoiceInfos.length==0) || (invoiceForm.invoiceForm==2 && selectInvoiceInfo.isFullInfo!=1)" @click="editInvoice(0)"></b>

      <!--普通发票显示抬头-->
      <div class="defaultInvoice" v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0 && invoiceForm.invoiceForm!=2">
        <div class="invoiceInfos" v-if="!selectInvoiceInfo">
          <span class="cell_input titleContent" v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0">{{invoiceInfos[0].titleContent}}</span>
          <span class="cell_input taxpayerIdentificationCode" v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0">{{invoiceInfos[0].taxpayerIdentificationCode}}</span>
          <b v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0" @click="editInvoice(invoiceInfos[0].id)"></b>
        </div>
        <div class="invoiceInfos" v-else>
          <span class="cell_input titleContent">{{selectInvoiceInfo.titleContent}}</span>
          <span class="cell_input taxpayerIdentificationCode">{{selectInvoiceInfo.taxpayerIdentificationCode}}</span>
          <b v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0" @click="editInvoice(selectInvoiceInfo.id)"></b>
        </div>

      </div>
      <!--增值税发票且发票完整显示抬头-->
      <div class="defaultInvoice" v-if="invoiceForm.invoiceTitleType!=0 && invoiceForm.invoiceForm==2 && selectInvoiceInfo && selectInvoiceInfo.isFullInfo==1">
        <div class="invoiceInfos">
          <span class="cell_input titleContent">{{selectInvoiceInfo.titleContent}}</span>
          <span class="cell_input taxpayerIdentificationCode">{{selectInvoiceInfo.taxpayerIdentificationCode}}</span>
          <b v-if="invoiceForm.invoiceTitleType!=0 && invoiceInfos.length>0" @click="editInvoice(selectInvoiceInfo.id)"></b>
        </div>
      </div>
    </div>

    <div class="invoice_4"  v-if="invoiceForm.invoiceForm>=0">
      <div>
        <h3>发票内容<span>{{text}}</span></h3>
      </div>

      <ul class="clear">
        <li :class="{active:invoiceForm.contentType==0}" @click="invoiceForm.contentType=0">商品明细</li>
        <li :class="{active:invoiceForm.contentType==1}" @click="invoiceForm.contentType=1" v-if="invoiceForm.invoiceForm!=2">商品分类</li>
      </ul>

      <p>发票内容将显示详细商品名称与价格信息</p>
    </div>

    <mt-popup
      v-model="popupVisible"
      position="bottom" class="mint-popup-4">
      <i class="popup_close icon-close iconfont" @click="popupVisible=false"></i>
      <div id="propertyTable">
        <h4>发票类型</h4>
        <ul>
          <li v-for="item in invoiceList" @click="invoiceCheck = item" :class="{active:invoiceCheck.tpid==item.tpid}">
            {{item.title}}
          </li>
        </ul>
        <div class="close_btn" :class="{close_btn_disabled:invoiceCheck.tpid==''}" @click="closePopupVisible">
          确 定
        </div>
      </div>
    </mt-popup>

    <div class="btn" @click="updataInvoice">确 定</div>
  </div>
</template>

<script>

  import { invoiceHint,saveInvoice,invoiceById,findInvoiceOfPage,insertOrUpdateInvoice } from '../../../api/getData';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  export default{

    data(){
      return {
        invoiceForm:{
          invoiceForm:-1,
          invoiceTitleType:0,
          title:'',
          tpid:'',
          contentType:0
        },
        popupVisible:false,
        invoiceList:[],
        invoiceCheck:{
          title:'',
          tpid:''
        },
        isDetailStore:0,
        invoiceInfos:[],
        titleContent:'',
        taxpayerIdentificationCode:'',
        commodityTemplateId:'',
        selectInvoiceInfo:'',
        text:'发票内容选项已根据税法调整，具体请以展示为准'
      }
    },
    components: {

    },
    watch:{

    },
    created(){
      this.commodityTemplateId = this.$store.state.Cookie.mutations.fetch('commodityTemplateId');
      this.invoiceHint();
      if(this.$store.state.invoiceId != 0){
        this.invoiceById();
      }
      this.isDetailStore = this.$store.state.invoiceDetail ? this.$store.state.invoiceDetail : 0;
      this.titleContent = this.$store.state.titleContent ? this.$store.state.titleContent : '';
      this.taxpayerIdentificationCode = this.$store.state.taxpayerIdentificationCode ? this.$store.state.taxpayerIdentificationCode : '';
      this.findInvoiceOfPage();
      this.invoiceForm.invoiceForm = this.$store.state.invoiceForm;
      this.invoiceForm.invoiceTitleType = this.$store.state.invoiceTitleType||"0";
      this.invoiceForm.contentType = this.$store.state.contentType;
    },
    methods:{
      //获取发票提示
      async invoiceHint() {
        try {
          const res = await invoiceHint();
          if (res.data.code == 0) {
            this.invoiceList = res.data.data.hints;
          } else {


          }
        } catch (err) {
          Toast('网络错误');
        }
      },
      //获取已有发票信息
      async findInvoiceOfPage() {
        try {
          const res = await findInvoiceOfPage();
          if (res.data.code == 0) {
            this.invoiceInfos = res.data.data.list;
            if(this.invoiceInfos&&this.invoiceInfos.length>0){
              if(this.titleContent==''){
                this.titleContent = this.invoiceInfos[0].titleContent;
              }
              if(this.taxpayerIdentificationCode==''){
                this.taxpayerIdentificationCode = this.invoiceInfos[0].taxpayerIdentificationCode;
              }
            }

            if(this.$store.state.commonInvoiceId){
              for(var i=0;i<this.invoiceInfos.length;i++){
                if(this.invoiceInfos[i].id==this.$store.state.commonInvoiceId){
                  this.selectInvoiceInfo=this.invoiceInfos[i];
                  this.titleContent = this.invoiceInfos[i].titleContent;
                  this.taxpayerIdentificationCode = this.invoiceInfos[i].taxpayerIdentificationCode;
                }
              }
            }else{
              for(var i=0;i<this.invoiceInfos.length;i++){
                if(this.invoiceInfos[i].isFullInfo){
                  this.selectInvoiceInfo=this.invoiceInfos[i];

                }
              }

            }
          } else {
            console.log("暂无发票信息");
          }
        } catch (err) {
          Toast(err);
        }
      },
      //根据发票ID查询详情
      async invoiceById() {
        try {
          const res = await invoiceById({id:this.$store.state.invoiceId});
          if (res.data.code == 0) {
            if(this.$store.state.invoiceForm!=-1){
              this.invoiceForm = {
                invoiceForm:res.data.data.invoice.invoiceForm,
                invoiceTitleType:res.data.data.invoice.invoiceTitleType,
                title:res.data.data.invoice.invoiceTitleContent,
                tpid:res.data.data.invoice.id,
                contentType:res.data.data.invoice.invoiceContentType
              };
            }
            if(this.$store.state.invoiceForm){
              this.invoiceForm.invoiceForm = this.$store.state.invoiceForm
            }
          } else {


          }
        } catch (err) {
          Toast('网络错误');
        }
      },
      //新增或编辑发票页面
      editInvoice(id){
        this.$store.dispatch("setInvoiceForm",this.invoiceForm.invoiceForm);
        this.$store.dispatch("setInvoiceTitleType",this.invoiceForm.invoiceTitleType);
        this.$store.dispatch("setContentType",this.invoiceForm.contentType);
        if(this.invoiceInfos.length>0){
          this.$router.push({path: '/shop/invoiceList/'+this.invoiceForm.invoiceForm});
        } else {
          this.$router.push({path: '/shop/editInvoice/'+id});
        }
      },
      //保存发票
      updataInvoice(){
        if(this.invoiceForm.invoiceForm<0){
          this.$store.dispatch("setInvoiceId",0);
          this.$router.push({path: '/shop/orderConfim'});
        }else{
          if(this.invoiceForm.invoiceTitleType==0 && this.invoiceForm.title==''){
            Toast('请填写抬头信息');
            return;
          }

          if(this.$store.state.commonInvoiceId){
            this.invoiceForm.commonInvoiceId = this.$store.state.commonInvoiceId;
          }else{
            if(this.invoiceInfos && this.invoiceInfos.length>0){
              this.invoiceForm.commonInvoiceId = this.invoiceInfos[0].id;
            }
          }
          if(!this.invoiceForm.contentType){
            this.invoiceForm.contentType=0;
          }
          this.saveInvoice();
        }
      },
      async saveInvoice() {
        try {
          const res = await saveInvoice(this.invoiceForm);
          if (res.data.code == 0) {
            this.$store.dispatch("setInvoiceForm",this.invoiceForm.invoiceForm);
            this.$store.dispatch("setInvoiceId",res.data.data.invoiceId);
            this.$store.dispatch("setInvoiceType",this.invoiceForm.invoiceTitleType);//缓存发票信息
            this.$router.push({path: '/shop/orderConfim'});
          } else {
            Toast({
              message: res.data.error,
              position: 'middle',
              duration: 3000
            });
          }
        } catch (err) {
          Toast('网络错误');
        }
      },

      //打开发票提示
      popupOpen(){
        this.popupVisible = true;
        this.invoiceCheck = {
          title:'',
          tpid:''
        }
      },

      closePopupVisible(){
        if(this.invoiceCheck.tpid==''){
          return;
        }else{
          this.invoiceForm.title = this.invoiceCheck.title;
          this.invoiceForm.tpid = this.invoiceCheck.tpid;
          this.popupVisible = false;
        }

      },
      checkInvoice(type){
        if(type==2){
          this.text ='增值税发票内容只支持商品明细'
        }else{
          this.text='发票内容选项已根据税法调整，具体请以展示为准'
        }
        // this.$store.dispatch("setInvoiceForm",type);
        if(this.commodityTemplateId!=7&&this.commodityTemplateId!=2){
          return;
        }else if(this.isDetailStore==1){
          return;
        }else{
          this.invoiceForm.invoiceForm=type;
        }
        if(type==2){
          this.invoiceForm.title= this.selectInvoiceInfo.titleContent;
          this.invoiceForm.tpid= this.selectInvoiceInfo.id;
          this.invoiceForm.invoiceTitleType=1;
        }
        this.invoiceForm.invoiceForm=type;
      },
      checkInvoice1(){
        this.text='发票内容选项已根据税法调整，具体请以展示为准'
        this.invoiceForm.invoiceForm=1 ;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../style/component/orderpay/orderInvoice.scss";
</style>
