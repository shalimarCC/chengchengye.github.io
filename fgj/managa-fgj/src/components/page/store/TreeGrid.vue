<template>
  <el-table
    :data="data"
    border
    style="width: 100%"
    :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" align="center" :key="column.dataIndex"
      :label="column.text">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <div class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-arrow-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-arrow-down" aria-hidden="true"></i>
        </div>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <b style="font-weight:100;">
            <span v-if="index==3">{{setTime(scope.row[column.dataIndex])}}</span>
            <span v-else-if="index==4">{{scope.row[column.dataIndex]}}%</span>
            <span v-else-if="index==5">{{scope.row[column.dataIndex]==1?'是':'否'}}</span>
            <span v-else-if="index==6">{{scope.row[column.dataIndex]==1?'是':'否'}}</span>
            <span v-else-if="index==7" @click="handleDelete(scope,6)"><img src="../../../../static/img/qrcode.png" style="width:50px;height:50px;cursor:pointer;" alt=""></span>
            <span v-else>{{scope.row[column.dataIndex]}}</span>
        </b>


      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" width="550"  fixed="right">
      <template scope="scope">
        <el-button
          size="small"
          type="primary"
          @click="handleDelete(scope,1)">
          编辑
        </el-button>

        <el-button
          size="small"
          type="primary"
          @click="handleDelete(scope,2)">
          选择管理员账户
        </el-button>

        <el-button
          size="small"
          type="warning"
          @click="handleDelete(scope,3)">
          添加下级
        </el-button>

        <el-button
          size="small"
          type="primary"
          @click="handleDelete(scope,4)"
          v-if="!scope.row.children&&scope.row.hasStoreMenu">
          设置门店菜单
        </el-button>

        <el-button
          size="small"
          type="primary"
          @click="handleDelete(scope,5)"
          v-if="!scope.row.parentId">
          查看商品
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import Utils from '../../treeTable/utils/index.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {}
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)

          return data
        }
        return me.dataSource
      }
    },
    methods: {
    // 显示行
      showTr: function (row, index) {
        let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
        row.row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      handleDelete (data,dataType) {
        this.$emit('setTableTree', [data.row,dataType])

      },
      //时间戳转换
        setTime(time) {
            const t = new Date(time);
            let y = t.getFullYear();
            let m = t.getMonth() + 1;
            let d = t.getDate();
            let h = t.getHours();
            let f = t.getMinutes();
            let s = t.getSeconds();
            if (m < 10) {
                m = '0' + m
            }
            if (d < 10) {
                d = '0' + d
            }
            if (h < 10) {
                h = '0' + h
            }
            if (f < 10) {
                f = '0' + f
            }
            if (s < 10) {
                s = '0' + s
            }
            return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s
        },
    }
  }
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .button{
    display: inline-block;
    cursor: pointer;

  }
</style>
