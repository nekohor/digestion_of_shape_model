# cShapeFeedbackD::Main(..)



注意设定弯辊力不是单力。

```c
sup_bend = (float) num_chocks * pcSched->pcFSSched->pcSPassRef[ps-1]->state.force_bnd_org;
```



## cShapeFeedbackD::Pass(..)

cShapeFeedbackD::Pass(..)主要分为以下三个部分：

- cShapeFeedbackD::Init(..)
- cShapeFeedbackD::Evaluate(..)
- cShapeFeedbackD::OprBnd(..)

### cShapeFeedbackD::Init(..)

cShapeFeedbackD::Init(..)函数位于shapefeedback_req.cxx文件中，并于cShapeFeedbackD::Pass(..)函数中执行。

inhb_t_w_calc为指示计算辊系热胀和磨损计算的布尔值，默认为false。

用pcRollbite->Calculate_DForce_DEnthick(..)和pcRollbite->Calculate_DForce_DExthick(..)计算轧制力对出入口厚度的偏导数。

初始化cUFDD实例的动态参数，包括ufd_modifier。

`inhb_t_w_calc`由于为false，因此初步设定`pce_wr_t_w_crn`和`wr_br_t_w_crn`为0.0。

f_wr_crn_off_adj从SPRP表中读取数据，之后用cCRLCD::Init(..)初始化CRLCD动态对象。注意有这么一个标识点wr_crn_off_sel_flag，用来指示初始化时psSLFG->wr_crn_off是否需要加上f_wr_crn_off_adj，一般这个值wr_crn_off_sel_flag默认为true。

```c
if ( pcTargtD->pcTargt->wr_crn_off_sel_flag )
	{
		pcFSPassD->pcFSStdD[ seg ]->pcCRLCD->Init( 
				  inhb_t_w_calc,
				  pce_wr_t_w_crn,
				  wr_br_t_w_crn,
				  psSAMP->wr_crn_vrn[ pass_idx ],
//@@2ND-2(MAC014) begin
				  //( psSLFG->wr_crn_off[ pass_idx ]  + psSPRP->wr_crn_off_adj[ pass_idx ]),
				  ( psSLFG->wr_crn_off[ pass_idx ]  + f_wr_crn_off_adj ),
//@@2ND-2(MAC014) end
				  pcFSPassD->pcFSStdD[ seg ]->pcEnPceD->width,
				  pcFSPassD->pcFSPass->wr_crn_vrn_i_gn,
				  pcFSPassD->pcFSPass->wr_crn_off_i_gn,
				  pcFSPassD->pcFSPass->wr_crn_cor_i_gn,
				  pcFSPassD->pcFSStdD[ seg ]->pcStdRollPrD
				  //psPDI->grt_idx 
				  );
	}
	else
	{
//@2ND(LC060) end
		pcFSPassD->pcFSStdD[ seg ]->pcCRLCD->Init( 
				  inhb_t_w_calc,
				  pce_wr_t_w_crn,
				  wr_br_t_w_crn,
				  psSAMP->wr_crn_vrn[ pass_idx ],
				  psSLFG->wr_crn_off[ pass_idx ],
				  pcFSPassD->pcFSStdD[ seg ]->pcEnPceD->width,
				  pcFSPassD->pcFSPass->wr_crn_vrn_i_gn,
				  pcFSPassD->pcFSPass->wr_crn_off_i_gn,
				  pcFSPassD->pcFSPass->wr_crn_cor_i_gn,
				  pcFSPassD->pcFSStdD[ seg ]->pcStdRollPrD
				  //psPDI->grt_idx 
				  );
```

之后用cLRGD::Init(..)初始化LRG动态对象。

### cShapeFeedbackD::Evaluate(..)

评估。

### cShapeFeedbackD::OprBnd(..)

cShapeFeedbackD::OprBnd(..)是对操作工弯辊力调整的自适应，自学习值从。内部主要调用的函数为cCRLCD::Opr_Bnd_Frc_Adpt(..)。

操作工对工作辊弯辊力的补偿wr_bnd_off先转化成等效的辊系凸度修正值stk_bnd_err。将 pcCRLCD->wr_cr_vrn赋值给stk_vrn_bnd。以stk_bnd_err和stk_vrn_bnd为实参，代入cCRLCD::Opr_Bnd_Frc_Adpt(..)计算。自学习计算采用积分控制，积分系数为wr_crn_cor_i_gn。wr_crn_cor_i_gn的配置在配置文件cfg_fpass.txt当中按机架划分。

## cShapeFeedbackD::Mill(..)

cShapeFeedbackD::Mill(..)函数的作用是根据实际测量的带钢凸度和平直度，计算辊系凸度自学习量。

### 逆序循环

从profile/flatness sensor中获得凸度和平直度的测量值meas_prf和meas_flt。

meas_flt直接作为出口应变差std_ex_strn，如果检测有误，则直接用std_ex_strn的计算值。

用出口检测到的meas_prf和std_ex_strn，代入pcLRGD->Ef_Ex_PU_Prf0(..)，重新计算ef_ex_pu_prf。

利用以上现有参数，结合pcSFBObsD[seg]->RepMill(..)重计算有效入口单位凸度ef_en_pu_prf。