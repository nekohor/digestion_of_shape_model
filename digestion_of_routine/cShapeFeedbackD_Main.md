# cShapeFeedbackD::Main(..)





## cShapeFeedbackD::Init(..)

cShapeFeedbackD::Init(..)函数位于shapefeedback_req.cxx文件中。

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