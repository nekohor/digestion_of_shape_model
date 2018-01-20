# SSU日志 FAQ



### Profile一栏中Vrn RM和Vrn RS是什么？

Profile一栏中Vrn RM和Vrn RS一般情况下指的是长期自学习值。

pcTargtD->pcTargt->prf_vrn_sel_flag默认值为true，在cfg_targt.txt文件中设定，若此值为false，则Profile一栏中Vrn RM和Vrn RS为短期自学习的psSAMP->prf_vrn_rm和psSAMP->prf_vrn_rs。



### 为什么弯辊力包络线最大值和最小值相反？

标签max和min指的是ufd有效单位凸度的最大值和最小值，最大的弯辊力会计算获得最小的有效单位凸度，最小的弯辊力会计算获得最大的有效单位凸度。为保持一致性，弯辊力包络线max与min对调。



### wr_crn_vrn_z是什么？

算是凸度自学习的一个初始值。当换辊算不准时restore进行补偿。配置文件里面有，据说很好用。

